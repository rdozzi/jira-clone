import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utilities/password';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';
import { getStorageType } from '../config/storage';
import { storageDispatcher } from '../utilities/storageDispatcher';
import { deleteUserCascade } from '../services/deletionServices/deleteUserCascade';

// Get all users
export async function getAllUsers(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ message: 'Users fetched successfully', users });
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
    const queryParams = req.query;
    const { userId, userEmail } = queryParams;

    if (!userId && !userEmail) {
      return res.status(400).json({ error: 'User ID or email is required' });
    }

    let user;

    if (userId) {
      const userIdParsed = parseInt(String(userId), 10);

      if (isNaN(userIdParsed)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      // Fetch user by ID
      user = await prisma.user.findUnique({ where: { id: userIdParsed } });
    } else if (userEmail) {
      user = await prisma.user.findUnique({
        where: { email: typeof userEmail === 'string' ? userEmail : undefined },
      });
    }

    if (!user || user.isDeleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User was retrieved successfully by user Id',
      data: user,
    });
    return;
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch user' });
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
    const { projectId } = req.params;
    const projectIdParsed = parseInt(projectId, 10);
    if (isNaN(projectIdParsed)) {
      res.status(400).json({ error: 'Invalid project ID' });
      return;
    }
    const users = await prisma.projectMember.findMany({
      where: { projectId: projectIdParsed },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            globalRole: true,
          },
        },
      },
    });
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'No users found for this project' });
    }
    res.status(200).json({
      message: 'Users successfully fetched by project Id',
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
    const { email, firstName, lastName, password, globalRole } = req.body;
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        passwordHash: hashedPassword,
        globalRole: globalRole,
      },
    });

    console.log(user);

    res.locals.logEvent = buildLogEvent({
      userId: userInfo.id,
      actorType: 'USER',
      action: 'CREATE_USER',
      targetId: user.id,
      targetType: 'USER',
      metadata: {
        role: `${user.globalRole}`,
        name: `${user.firstName}_${user.lastName}`,
        email: `${user.email}`,
      },
    });
    res.status(201).json({ message: 'User successfully created.', data: user });
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
  const { userId } = req.params;
  const userIdParsed = parseInt(userId, 10);
  const userData = req.body;

  try {
    const oldUser = await prisma.user.findUnique({
      where: { id: userIdParsed },
    });
    if (!oldUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const newUser = await prisma.user.update({
      where: { id: userIdParsed },
      data: {
        ...userData,
      },
    });

    const changes = generateDiff(oldUser, newUser);

    res.locals.logEvent = buildLogEvent({
      userId: userInfo.id,
      actorType: 'USER',
      action: 'UPDATE_USER',
      targetId: userIdParsed,
      targetType: 'USER',
      metadata: {
        name: `${newUser.firstName}_${newUser.lastName}`,
        changes,
      },
    });

    res.status(200).json({ message: 'User updated successfully', newUser });
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
    const { userId } = req.params;
    const userIdParsed = parseInt(userId, 10);

    const existingUser = await prisma.user.findUnique({
      where: { id: userIdParsed },
    });

    if (!existingUser || existingUser.isDeleted === true) {
      res
        .status(404)
        .json({ error: `User with ID ${userIdParsed} not found.` });
      return;
    }

    await deleteUserCascade(userIdParsed);

    const deletedUserData = await prisma.user.update({
      where: { id: userIdParsed },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    res.locals.logEvent = buildLogEvent({
      userId: userInfo.id,
      actorType: 'USER',
      action: 'DELETE_USER',
      targetId: userIdParsed,
      targetType: 'USER',
      metadata: {
        name: `${deletedUserData.firstName}_${deletedUserData.lastName}`,
        deletedOn: `${deletedUserData.deletedAt}`,
      },
    });

    res.status(200).json({
      message: `Soft delete action successful. Date ${deletedUserData.deletedAt} added to deletedAt`,
    });
  } catch (error) {
    console.error('Error soft-deleting user: ', error);
    res.status(500).json({ error: 'Failed to soft-delete user' });
  }
}

// Update user avatar
export async function updateUserAvatar(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { userId } = req.params;
    const userIdParsed = parseInt(userId, 10);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const storageType = getStorageType();
    const fileMetadata = await storageDispatcher(req.file, storageType);

    const fileSource =
      storageType === 'CLOUD' ? fileMetadata.cloudUrl : fileMetadata.savedPath;

    const updatedUser = await prisma.user.update({
      where: { id: userIdParsed },
      data: {
        avatarSource: fileSource,
      },
    });

    res.status(200).json({
      avatarSource: updatedUser.avatarSource,
      message: 'User avatar updated successfully',
    });
    return;
  } catch (error) {
    console.error('Error updating user avatar: ', error);
    res.status(500).json({ error: 'Failed to update user avatar' });
    return;
  }
}
