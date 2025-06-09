import { RequestHandler, Request, Response, NextFunction } from 'express';
import { GlobalRole } from '@prisma/client';

export function authorizeSelfOrAdmin(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestUserId = res.locals.userInfo.Id;
    const requestUserGlobalrole = res.locals.userInfo.globalRole;
    const targetUserId = parseInt(req.params.id, 10);

    if (
      requestUserId === targetUserId ||
      requestUserGlobalrole === GlobalRole.ADMIN ||
      requestUserGlobalrole === GlobalRole.SUPERADMIN
    ) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: insufficient privileges' });
    }
  };
}
