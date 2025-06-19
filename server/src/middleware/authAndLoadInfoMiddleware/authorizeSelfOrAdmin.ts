import { Request, Response, NextFunction } from 'express';
import { GlobalRole } from '@prisma/client';

export function authorizeSelfOrAdmin() {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestUserId = res.locals.userInfo.Id;
    const requestUserGlobalrole = res.locals.userInfo.globalRole;

    const { userId } = req.params;
    const userIdParsed = parseInt(userId, 10);

    if (
      requestUserId === userIdParsed ||
      requestUserGlobalrole === GlobalRole.ADMIN ||
      requestUserGlobalrole === GlobalRole.SUPERADMIN
    ) {
      next();
      return;
    } else {
      res.status(403).json({ message: 'Forbidden: insufficient privileges' });
      return;
    }
  };
}
