import { Request, Response } from 'express';
import { PrismaClient, GlobalRole } from '@prisma/client';
import { hashPassword } from '../utilities/password';
import { buildLogEvent } from '../services/buildLogEvent';

// Add middleware protection layers later (Sanitization, rate limiter, input validation, IP Check)

export async function seedSuperAdmin(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    // Check if a SuperAdmin exists
    const superAdmin = await prisma.user.findFirst({
      where: { globalRole: GlobalRole.SUPERADMIN },
    });

    if (superAdmin) {
      res.status(409).json({ message: 'SuperAdmin already exists' });
      return;
    }

    const { email, firstName, lastName, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        passwordHash: hashedPassword,
        globalRole: GlobalRole.SUPERADMIN,
      },
    });

    res.locals.logEvent = buildLogEvent({
      userId: user.id,
      actorType: 'USER',
      action: 'CREATE_USER/SUPERADMIN_SEED',
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
