import prisma from '../../lib/prisma';
import { Request, Response, NextFunction } from 'express';

export async function getUserInfoFromToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const tokenRecord = res.locals.validatedQuery;

  const user = await prisma.user.findUnique({
    where: { id: tokenRecord.userId },
  });

  if (!user || user?.isDeleted || user?.isBanned) {
    return res.status(400).json({ message: 'Invalid user' });
  }

  res.locals.userId = user?.id;
  res.locals.organizationId = user?.organizationId;

  next();
}
