import { Response, NextFunction, RequestHandler } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import { GlobalRole } from '@prisma/client';
import { hasRequiredGlobalRole } from '../lib/roles';

export function authorizeGlobalRole(requiredRole: GlobalRole) {
  return ((req: CustomRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ message: 'No role found' });
    }

    if (!hasRequiredGlobalRole(userRole, requiredRole)) {
      return res.status(403).json({ message: 'Insufficient Permissions' });
    }

    next();
  }) as unknown as RequestHandler;
}
