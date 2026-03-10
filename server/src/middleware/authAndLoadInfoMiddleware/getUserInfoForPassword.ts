import { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma';

export async function getUserInfoForPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email } = res.locals.validatedBody;

  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) {
    return res
      .status(200)
      .json({ message: 'A reset email has been sent to this account.' });
  }

  res.locals.userId = user.id;
  res.locals.firstName = user.firstName;
  res.locals.email = user.email;
  res.locals.organizationId = user.organizationId;

  next();
}
