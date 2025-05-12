import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

import { verifyPassword } from '../utilities/password';
import dotenv from 'dotenv';

dotenv.config();

export async function loginUser(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const userData = req.body;
    const user = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!user) {
      return res.status(401).json({ error: 'No user found' });
    }

    const isPasswordValid = await verifyPassword(
      userData.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, globalRole: user.globalRole },
      process.env.JWT_SECRET as string,
      {
        expiresIn: Number(process.env.JWT_EXPIRATION),
      }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user.id,
      userRole: user.globalRole,
      expiresIn: Date.now() + Number(process.env.JWT_EXPIRATION) * 1000,
    });
  } catch (error) {
    console.error('Error logging in user: ', error);
    res.status(500).json({ error: 'Failed to log in user' });
  }
}
