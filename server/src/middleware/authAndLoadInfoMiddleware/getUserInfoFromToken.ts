import prisma from '../../lib/prisma';
import { Request, Response, NextFunction } from 'express';
import { generateHashedToken } from '../../utilities/tokenUtilities/generateToken';
import { isUserValidForToken } from '../../utilities/authUtilities/isUserValidForToken';

export async function getUserInfoFromToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const rawToken = res.locals.validatedQuery;

  const tokenHash = generateHashedToken(rawToken);

  const tokenRecord = await prisma.passwordToken.findUnique({
    where: { tokenHash: tokenHash },
  });

  if (!tokenRecord) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  const user = await prisma.user.findUnique({
    where: { id: tokenRecord?.userId },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid user' });
  }

  if (!isUserValidForToken(user, tokenRecord.purpose)) {
    return res.status(400).json({ message: 'Invalid user' });
  }

  res.locals.userId = user?.id;
  res.locals.organizationId = user?.organizationId;
  res.locals.tokenRecord = tokenRecord;

  next();
}
