import prisma from '../../lib/prisma';
import { Request, Response, NextFunction } from 'express';
import { validateToken } from '../../services/tokenServices/tokenFunctions';

export async function confirmToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { token } = req.query;

  const tokenRecord = await validateToken(prisma, token as string);

  if (!tokenRecord) {
    res.status(400).json({ message: 'Token is invalid or expired' });
  }

  res.locals.tokenRecord = tokenRecord;

  next();
}
