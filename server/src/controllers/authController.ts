import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { verifyPassword } from '../utilities/password';
import { buildLogEvent } from '../services/buildLogEvent';

dotenv.config();

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const userData = req.body;
    const user = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!user || user.deletedAt) {
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

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'USER_LOGIN',
      targetId: user.id,
      targetType: 'AUTHENTICATION',
      metadata: {
        id: user.id,
        name: `${user.firstName}_${user.lastName}`,
        email: user.email,
        globalRole: user.globalRole,
        token: token,
      },
      ticketId: null,
      boardId: null,
      projectId: null,
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user.id,
      userRole: user.globalRole,
      expiresIn: Date.now() + Number(process.env.JWT_EXPIRATION) * 1000,
    });
    next();
  } catch (error) {
    console.error('Error logging in user: ', error);
    res.status(500).json({ error: 'Failed to log in user' });
  }
}

export async function logoutUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = parseInt((decoded as { id: string }).id, 10);

    res.locals.logEvent = buildLogEvent({
      userId: null,
      actorType: 'USER',
      action: 'USER_LOGOUT',
      targetId: userId,
      targetType: 'AUTHENTICATION',
      metadata: {
        id: userId,
        token: token,
      },
      ticketId: null,
      boardId: null,
      projectId: null,
    });

    next();
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out user: ', error);
    res.status(500).json({ error: 'Failed to log out user' });
  }
}
