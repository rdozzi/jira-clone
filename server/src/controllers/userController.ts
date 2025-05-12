import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utilities/password';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';
import { getStorageType } from '../config/storage';
import { storageDispatcher } from '../utilities/storageDispatcher';

// Get all users
export async function getAllUsers(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

// Get user by Id
export async function getUser(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { id, email } = req.query;
    console.log('ID:', id, 'Email:', email);

    if (!id && !email) {
      return res.status(400).json({ error: 'User ID or email is required' });
    }

    let user;

    if (id) {
      const userId = parseInt(String(id), 10);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      // Fetch user by ID
      user = await prisma.user.findUnique({ where: { id: userId } });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email: typeof email === 'string' ? email : undefined },
      });
    }

    if (!user || user.deletedAt) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

// Create user
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const { email, firstName, lastName, passwordHash, role } = req.body;
    const hashedPassword = await hashPassword(passwordHash);

    const user = await prisma.user.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        passwordHash: hashedPassword,
        globalRole: role,
      },
    });

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
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

    res.status(201).json(user);
    next();
  } catch (error) {
    console.error('Error creating user: ', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

// Update user
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const userData = req.body;
    const { id } = req.params;

    const oldUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!oldUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...userData,
      },
    });

    const changes = generateDiff(oldUser, newUser);

    res.locals.logEvent = buildLogEvent({
      userId: Number(id),
      actorType: 'USER',
      action: 'UPDATE_USER',
      targetId: Number(id),
      targetType: 'USER',
      metadata: {
        name: `${newUser.firstName}_${newUser.lastName}`,
        changes,
      },
      ticketId: null,
      boardId: null,
      projectId: null,
    });

    res.status(200).json(newUser);
    next();
  } catch (error) {
    console.error('Error editing user: ', error);
    res.status(500).json({ error: 'Failed to edit user' });
  }
}

// Delete User (Patch)
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res
        .status(404)
        .json({ error: `User with ID ${userId} not found.` });
    }

    const deletedUserData = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        deletedAt: new Date(),
      },
    });

    res.locals.logEvent = buildLogEvent({
      userId: userId,
      actorType: 'USER',
      action: 'DELETE_USER',
      targetId: userId,
      targetType: 'USER',
      metadata: {
        name: `${deletedUserData.firstName}_${deletedUserData.lastName}`,
        deletedOn: `${deletedUserData.deletedAt}`,
      },
      ticketId: null,
      boardId: null,
      projectId: null,
    });

    res.status(200).json({
      message: `Soft delete action successful. Date ${deletedUserData.deletedAt} added to deletedAt`,
    });
    next();
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
    const { id } = req.params;
    const userId = parseInt(id, 10);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const storageType = getStorageType();
    const fileMetadata = await storageDispatcher(req.file, storageType);

    const fileSource =
      storageType === 'CLOUD' ? fileMetadata.cloudUrl : fileMetadata.savedPath;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatarSource: fileSource,
      },
    });

    res.status(200).json({
      avatarSource: updatedUser.avatarSource,
      message: 'User avatar updated successfully',
    });
  } catch (error) {
    console.error('Error updating user avatar: ', error);
    res.status(500).json({ error: 'Failed to update user avatar' });
  }
}
