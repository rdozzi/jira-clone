import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { verifyPassword } from '../utilities/password';
import { buildLogEvent } from '../services/buildLogEvent';
import { logBus } from '../lib/logBus';

dotenv.config();

export async function loginUser(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { email, password } = res.locals.validatedBody;
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    const fakeHash =
      '$2a$12$lI.goTb7KK0ctewAzqHcteO65M7Su2esatiZjxuP3FMsvDwHB1Qme';
    // 'FaKEHAshMKXI#*()&%#%!$)' was hashed with 12 rounds from https://bcrypt-generator.com

    if (!user || !password || user.deletedAt) {
      await verifyPassword('fakePassword', fakeHash);
      return res.status(401).json({ error: 'Invalid Credentials' });
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        globalRole: user.globalRole,
        organizationId: user.organizationId,
        organizationRole: user.organizationRole,
      },
      process.env.JWT_SECRET as string
    );

    const logEvents = [
      buildLogEvent({
        userId: user.id,
        actorType: 'USER',
        action: 'USER_LOGIN',
        targetId: user.id,
        targetType: 'AUTHENTICATION',
        organizationId: user.organizationId,
        metadata: {
          id: user.id,
          name: `${user.firstName}_${user.lastName}`,
          email: user.email,
          globalRole: user.globalRole,
          organizationRole: user.organizationRole,
          timestamp: new Date().toISOString(),
        },
      }),
    ];

    logBus.emit('activityLog', logEvents);

    res.status(200).json({
      message: 'Login successful',
      userId: user.id,
      email: user.email,
      globalRole: user.globalRole,
      organizationRole: user.organizationRole,
      organizationId: user.organizationId,
      token: token,
    });
  } catch (error) {
    console.error('Error logging in user: ', error);
    return res.status(500).json({ error: 'Failed to log in user' });
  }
}

export async function logoutUser(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = parseInt((decoded as { id: string }).id, 10);
    const organizationId = parseInt(
      (decoded as { organizationId: string }).organizationId,
      10
    );

    const logEvents = [
      buildLogEvent({
        userId: userId,
        actorType: 'USER',
        action: 'USER_LOGOUT',
        targetId: userId,
        targetType: 'AUTHENTICATION',
        organizationId: organizationId,
        metadata: {
          id: userId,
          timestamp: new Date().toISOString(),
        },
      }),
    ];

    logBus.emit('activityLog', logEvents);

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out user: ', error);
    return res.status(500).json({ error: 'Failed to log out user' });
  }
}
