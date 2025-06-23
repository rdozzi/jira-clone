import { Response, NextFunction, RequestHandler } from 'express';
import { GlobalRole } from '@prisma/client';
import { hasRequiredGlobalRole } from '../../lib/roles';

export function authorizeGlobalRole(requiredRole: GlobalRole) {
  return ((req: Request, res: Response, next: NextFunction) => {
    const userRole = res.locals.userInfo.globalRole;

    if (!userRole) {
      res.status(403).json({ message: 'No role found' });
      return;
    }

    if (!hasRequiredGlobalRole(userRole, requiredRole)) {
      res.status(403).json({ message: 'Insufficient Permissions' });
      return;
    }

    next();
    return;
  }) as unknown as RequestHandler;
}
