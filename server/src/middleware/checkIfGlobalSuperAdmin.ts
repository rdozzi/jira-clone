import { Request, Response, NextFunction } from 'express';
import { GlobalRole } from '@prisma/client';

export function checkIfGlobalSuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const globalRole = res.locals.userInfo?.globalRole;

  if (globalRole === GlobalRole.SUPERADMIN) {
    res.locals.isGlobalSuperAdmin = true;
  } else {
    res.locals.isGlobalSuperAdmin = false;
  }

  next();
}
