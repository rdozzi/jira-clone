import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../password';
import { buildLogEvent } from '../services/buildLogEvent';

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
export async function getUserById(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch users' });
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
    const { email, first_name, last_name, passwordHash, role } = req.body;
    const hashedPassword = await hashPassword(passwordHash);

    const user = await prisma.user.create({
      data: {
        email: email,
        first_name: first_name,
        last_name: last_name,
        passwordHash: hashedPassword,
        role: role,
      },
    });

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'CREATE_USER',
      targetId: user.id,
      targetType: 'USER',
      metadata: {
        role: `${user.role}`,
        name: `${user.first_name}_${user.last_name}`,
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

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const { id } = req.params;
    const deleteData = await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(deleteData);
    next();
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
