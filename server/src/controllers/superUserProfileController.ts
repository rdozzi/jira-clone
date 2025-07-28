import { GlobalRole, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { generateDiff } from '../services/generateDiff';
import { buildLogEvent } from '../services/buildLogEvent';
import { getStorageType } from '../config/storage';
import { storageDispatcher } from '../utilities/storageDispatcher';

export async function getSuperUsers(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const userInfo = res.locals.userInfo;
    const query = Object.keys(res.locals.validatedQuery)[0];
    const data = res.locals.validatedQuery[query];

    const users = await prisma.user.findMany({
      where: {
        ...(query === 'userId' && { id: data }),
        globalRole: GlobalRole.SUPERUSER,
      },
    });

    res.locals.logEvent = buildLogEvent({
      userId: userInfo.id,
      actorType: 'USER',
      action: 'GET_SUPERUSER',
      targetId: data, //query paramId
      targetType: 'SUPERUSER',
      organizationId: null,
      metadata: {
        // userId queryParam defined
        ...(query && {
          note: `SuperUser ${userInfo.id} inquired about SuperUser: ${data}`,
        }),
        //userId queryParam undefined
        ...(!query && {
          note: `SuperUser ${userInfo.id} inquired about all SuperUsers`,
        }),
        timestamp: new Date().toISOString(),
      },
    });

    res.status(200).json({
      ...(query && { message: 'User fetched successfully', data: users[0] }),
      ...(!query && { message: 'Users fetched successfully', data: users }),
    });
    return;
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch users' });
    return;
  }
}

// Update SuperUser
export async function updateSuperUser(
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

  try {
    const oldUser = await prisma.user.findUnique({
      where: { id: userId, globalRole: GlobalRole.SUPERUSER },
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
      where: { id: userId, globalRole: GlobalRole.SUPERUSER },
      data: {
        ...userData,
      },
    });

    const changes = generateDiff(oldUser, newUser);

    res.locals.logEvent = buildLogEvent({
      userId: userInfo.id,
      actorType: 'USER',
      action: 'UPDATE_SUPERUSER',
      targetId: userId,
      targetType: 'USER',
      organizationId: null,
      metadata: {
        name: `${newUser.firstName}_${newUser.lastName}`,
        changes,
        timeStamp: new Date().toISOString(),
      },
    });

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

// Update SuperUser avatar
export async function updateSuperUserAvatar(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const userId = res.locals.validatedParam;

    const user = await prisma.user.findUnique({
      where: { id: userId, globalRole: GlobalRole.SUPERUSER },
    });

    if (user?.isDeleted || user?.deletedAt || user?.isBanned) {
      return res
        .status(400)
        .json({ error: 'Deleted or banned user avatar cannot be changed' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const storageType = getStorageType();
    const fileMetadata = await storageDispatcher(req.file, storageType);

    const fileSource =
      storageType === 'CLOUD' ? fileMetadata.cloudUrl : fileMetadata.savedPath;

    const updatedUser = await prisma.user.update({
      where: { id: userId, globalRole: GlobalRole.SUPERUSER },
      data: {
        avatarSource: fileSource,
      },
    });

    res.status(200).json({
      data: {
        id: `${updatedUser.id}`,
        avatarSource: updatedUser.avatarSource,
        userName: `${updatedUser.firstName} ${updatedUser.lastName}`,
        organizationId: `${updatedUser.organizationId}`,
      },
      message: 'User avatar updated successfully',
    });
    return;
  } catch (error) {
    console.error('Error updating user avatar: ', error);
    res.status(500).json({ error: 'Failed to update user avatar' });
    return;
  }
}

// Delete SuperUser
export async function deleteSuperUser(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    // From storeUserAndProjectInfo
    const userInfo = res.locals.userInfo;
    const userId = res.locals.validatedParam;

    if (userInfo.id === userId) {
      res.status(403).json({ error: `SuperUser cannot delete themselves` });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId, globalRole: GlobalRole.SUPERUSER },
    });

    if (!existingUser || existingUser.isDeleted === true) {
      res.status(404).json({ error: `User with ID ${userId} not found.` });
      return;
    }

    const deletedUserData = await prisma.user.update({
      where: { id: userId, globalRole: GlobalRole.SUPERUSER },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    res.locals.logEvent = buildLogEvent({
      userId: userInfo.id,
      actorType: 'USER',
      action: 'DELETE_SUPERUSER',
      targetId: userId,
      targetType: 'USER',
      organizationId: null,
      metadata: {
        name: `${deletedUserData.firstName}_${deletedUserData.lastName}`,
        deletedOn: `${deletedUserData.deletedAt}`,
      },
    });

    res.status(200).json({
      message: `User deleted successfully`,
      data: {
        id: deletedUserData.id,
        name: `${deletedUserData.firstName} ${deletedUserData.lastName}`,
      },
    });
  } catch (error) {
    console.error('Error soft-deleting user: ', error);
    res.status(500).json({ error: 'Failed to soft-delete user' });
  }
}
