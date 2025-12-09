import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utilities/password';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';
import { deleteUserCascade } from '../services/deletionServices/deleteUserCascade';
import { createResourceService } from '../services/organizationUsageServices/createResourceService';
import { logBus } from '../lib/logBus';

// Get all users
export async function getAllUsers(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const organizationId = res.locals.userInfo.organizationId;
    const users = await prisma.user.findMany({
      where: { organizationId: organizationId },
    });
    res
      .status(200)
      .json({ message: 'Users fetched successfully', data: users });
    return;
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch users' });
    return;
  }
}

// Get user by Id and email
export async function getUser(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const query = Object.keys(res.locals.validatedQuery)[0];
    const data = res.locals.validatedQuery[query];
    const organizationId = res.locals.userInfo.organizationId;

    let user;

    if (query !== 'userId' && query !== 'userEmail') {
      return res.status(400).json({ error: 'Invalid query parameter' });
    }

    if (query === 'userId') {
      user = await prisma.user.findUnique({
        where: { id: data, organizationId: organizationId },
      });
    } else if (query === 'userEmail') {
      user = await prisma.user.findUnique({
        where: {
          email: typeof data === 'string' ? data : undefined,
          organizationId: organizationId,
        },
      });
    }

    if (!user || user.isDeleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Users retrieved successfully',
      data: user,
    });
    return;
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch user' });
    return;
  }
}

export async function getUserSelf(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const userInfo = res.locals.userInfo;

    const user = await prisma.user.findUnique({
      where: { id: userInfo.id, organizationId: userInfo.organizationId },
    });

    res.status(200).json({
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'failed to fetch user' });
    return;
  }
}

// Get users by ProjectId
export async function getUserByProjectId(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const projectId = res.locals.validatedParam;
    const organizationId = res.locals.userInfo.organizationId;

    const users = await prisma.projectMember.findMany({
      where: { projectId: projectId, organizationId: organizationId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            organizationRole: true,
          },
        },
      },
    });
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'No users found for this project' });
    }
    res.status(200).json({
      message: 'Users fetched successfully',
      data: users.map((member) => member.user),
    });
    return;
  } catch (error) {
    console.error('Error fetching users by project ID: ', error);
    res.status(500).json({ error: 'Failed to fetch users by project ID' });
    return;
  }
}

// Create user
export async function createUser(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    // From storeUserAndProjectInfo
    const userInfo = res.locals.userInfo;
    const { email, firstName, lastName, password, organizationRole } =
      res.locals.validatedBody;
    const hashedPassword = await hashPassword(password);
    const organizationId = res.locals.userInfo.organizationId;
    const resourceType = res.locals.resourceType;

    const user = await createResourceService(
      prisma,
      resourceType,
      organizationId,
      async (tx) =>
        await tx.user.create({
          data: {
            email: email,
            firstName: firstName,
            lastName: lastName,
            passwordHash: hashedPassword,
            organizationRole: organizationRole,
            organizationId: organizationId,
          },
        })
    );

    const logEvents = [
      buildLogEvent({
        userId: userInfo.id,
        actorType: 'USER',
        action: 'CREATE_USER',
        targetId: user.id,
        targetType: 'USER',
        organizationId: organizationId,
        metadata: {
          role: `${user.globalRole}`,
          name: `${user.firstName}_${user.lastName}`,
          email: `${user.email}`,
        },
      }),
    ];

    logBus.emit('activityLog', logEvents);

    res.status(201).json({ message: 'User created successfully', data: user });
    return;
  } catch (error) {
    console.error('Error creating user: ', error);
    res.status(500).json({ error: 'Failed to create user' });
    return;
  }
}

// Update user
export async function updateUser(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  // Information about the user performing this action
  // const userInfo: { id: number; globalRole: GlobalRole } = res.locals.userInfo;
  const userInfo = res.locals.userInfo;

  // Pertains to userId payload sent to endpoint
  const userId = res.locals.validatedParam;
  const userData = res.locals.validatedBody;
  const organizationId = res.locals.userInfo.organizationId;

  try {
    const oldUser = await prisma.user.findUnique({
      where: { id: userId, organizationId: organizationId },
    });

    if (!oldUser || oldUser.isDeleted || oldUser.deletedAt) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (oldUser.isBanned) {
      res
        .status(404)
        .json({ error: 'Banned user information cannot be udpated' });
      return;
    }

    const newUser = await prisma.user.update({
      where: { id: userId, organizationId: organizationId },
      data: {
        ...userData,
      },
    });

    const changes = generateDiff(oldUser, newUser);

    const logEvents = [
      buildLogEvent({
        userId: userInfo.id,
        actorType: 'USER',
        action: 'UPDATE_USER',
        targetId: userId,
        targetType: 'USER',
        organizationId: organizationId,
        metadata: {
          name: `${newUser.firstName}_${newUser.lastName}`,
          changes,
          timeStamp: new Date().toISOString(),
        },
      }),
    ];

    logBus.emit('activityLog', logEvents);

    res
      .status(200)
      .json({ message: 'User updated successfully', data: newUser });
    return;
  } catch (error) {
    console.error('Error editing user: ', error);
    res.status(500).json({ error: 'Failed to edit user' });
    return;
  }
}

// Delete User (Patch)
export async function deleteUser(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    // From storeUserAndProjectInfo
    const userInfo = res.locals.userInfo;
    const userId = res.locals.validatedParam;
    const organizationId = res.locals.userInfo.organizationId;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId, organizationId: organizationId },
    });

    if (!existingUser || existingUser.isDeleted === true) {
      res.status(404).json({ error: `User with ID ${userId} not found.` });
      return;
    }

    // User deletion isn't treated the same way because of soft deletions. User counts for organizations will not be decremented for the MVP.
    await deleteUserCascade(userId, organizationId);

    const deletedUserData = await prisma.user.update({
      where: { id: userId, organizationId: organizationId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    const logEvents = [
      buildLogEvent({
        userId: userInfo.id,
        actorType: 'USER',
        action: 'DELETE_USER',
        targetId: userId,
        targetType: 'USER',
        organizationId: organizationId,
        metadata: {
          name: `${deletedUserData.firstName}_${deletedUserData.lastName}`,
          deletedOn: `${deletedUserData.deletedAt}`,
        },
      }),
    ];

    logBus.emit('activityLog', logEvents);

    res.status(200).json({
      message: `User deleted successfully. Deleted at ${deletedUserData.deletedAt}`,
      data: {
        id: deletedUserData.id,
        name: `${deletedUserData.firstName} ${deletedUserData.lastName}`,
        organizationId: deletedUserData.organizationId,
      },
    });
  } catch (error) {
    console.error('Error soft-deleting user: ', error);
    res.status(500).json({ error: 'Failed to soft-delete user' });
  }
}
