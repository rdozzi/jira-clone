import { GlobalRole } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export function requireGlobalSuperUser() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userGlobalRole = res.locals.userInfo.globalRole;

    if (userGlobalRole !== GlobalRole.SUPERUSER) {
      res
        .status(401)
        .json({ message: 'Unauthorized: Insufficient Permissions' });
      return;
    }

    next();
  };
}
