import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../password';

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
  prisma: PrismaClient
) {
  try {
    // const userDetails = await req.body;
    const { email, name, passwordHash, role } = req.body;
    const hashedPassword = await hashPassword(passwordHash);
    const user = await prisma.user.create({
      data: {
        email: email,
        first_name: name,
        last_name: name,
        passwordHash: hashedPassword,
        role: role,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error creating user: ', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { id } = req.params;
    const deleteData = await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(deleteData);
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
