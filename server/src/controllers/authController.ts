import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { PasswordToken, PrismaClient } from '@prisma/client';

import { hashPassword, verifyPassword } from '../utilities/password';
import { buildLogEvent } from '../services/buildLogEvent';
import { logBus } from '../lib/logBus';
import { tokenGenerationService } from '../services/tokenServices/tokenGenerationService';

export async function loginUser(
  req: Request,
  res: Response,
  prisma: PrismaClient,
) {
  try {
    const { email, password } = res.locals.validatedBody;
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    const fakeHash =
      '$2a$12$lI.goTb7KK0ctewAzqHcteO65M7Su2esatiZjxuP3FMsvDwHB1Qme';
    // 'FaKEHAshMKXI#*()&%#%!$)' was hashed with 12 rounds from https://bcrypt-generator.com

    if (
      !user ||
      !password ||
      user.deletedAt ||
      !user.passwordHash ||
      user.mustChangePassword ||
      !user.isEmailVerified
    ) {
      await verifyPassword('fakePassword', fakeHash);
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      await verifyPassword('fakePassword', fakeHash);
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        globalRole: user.globalRole,
        organizationId: user.organizationId,
        organizationRole: user.organizationRole,
      },
      process.env.JWT_SECRET as string,
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
      mustChangePassword: user.mustChangePassword,
      token: token,
    });
  } catch (error) {
    console.error('Error logging in user: ', error);
    return res.status(500).json({ error: 'Failed to log in user' });
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    // Variables from checkForToken middleware
    const userId = res.locals.userIdDecoded;
    const organizationId = res.locals.organizationIdDecoded;

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

export async function requestPasswordReset(
  req: Request,
  res: Response,
  prisma: PrismaClient,
) {
  try {
    const userId = res.locals.userId;
    const firstName = res.locals.firstName;
    const email = res.locals.email;
    const organizationId = res.locals.organizationId;

    await tokenGenerationService(
      prisma,
      userId,
      userId,
      firstName,
      email,
      organizationId,
      'RESET_PASSWORD',
      'RESET_PASSWORD',
    );

    return res
      .status(200)
      .json({ message: 'A reset email has been sent to this account.' });
  } catch (error) {
    console.error('Password reset request failed:', error);

    return res.status(200).json({
      message: 'A reset email has been sent to this account.',
    });
  }
}

// Change Password (RESET_PASSWORD, ACCOUNT_INVITE, ACCOUNT_ACTIVATION)
export async function changePasswordPublic(
  req: Request,
  res: Response,
  prisma: PrismaClient,
) {
  const tokenRecord: PasswordToken = res.locals.tokenRecord;

  const userId = res.locals.userId;
  const organizationId = res.locals.organizationId;
  const { newPassword } = res.locals.validatedBody;

  const result = await prisma.$transaction(async (tx) => {
    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await tx.user.update({
      where: { id: userId, organizationId: organizationId },
      data: {
        passwordHash: hashedPassword,
        mustChangePassword: false,
        isEmailVerified: true,
      },
    });

    await tx.passwordToken.update({
      where: { id: tokenRecord.id, tokenHash: tokenRecord.tokenHash },
      data: { hasBeenUsed: true },
    });

    return { updatedUser };
  });

  const logEvents = [
    buildLogEvent({
      userId: userId,
      actorType: 'USER',
      action: tokenRecord.purpose,
      targetId: userId,
      targetType: 'USER',
      organizationId: organizationId,
      metadata: {
        name: `${result.updatedUser.firstName}_${result.updatedUser.lastName}`,
        email: result.updatedUser.email,
        timeStamp: new Date().toISOString(),
      },
    }),
  ];

  logBus.emit('activityLog', logEvents);

  res.status(200).json({
    message: 'User password updated successfully',
  });
  return;
}
