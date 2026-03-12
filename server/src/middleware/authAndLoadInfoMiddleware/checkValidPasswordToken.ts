import { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma';
import { generateHashedToken } from '../../utilities/tokenUtilities/generateToken';

export async function checkValidPasswordToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const validatedToken = res.locals.validatedQuery;

  const hashedToken = generateHashedToken(validatedToken);

  const tokenRecord = await prisma.passwordToken.findUnique({
    where: { tokenHash: hashedToken },
  });

  if (
    !tokenRecord ||
    tokenRecord.hasBeenUsed ||
    tokenRecord.expiresAt.getTime() < Date.now()
  ) {
    return res.status(400).json({ message: 'Token is invalid or expired' });
  }

  res.locals.tokenRecord = tokenRecord;

  next();
}
