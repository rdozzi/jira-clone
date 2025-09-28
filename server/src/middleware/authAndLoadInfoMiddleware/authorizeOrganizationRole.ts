import { Response, NextFunction, RequestHandler } from 'express';
import { OrganizationRole } from '@prisma/client';
import { hasRequiredOrganizationRole } from '../../lib/roles';

export function authorizeOrganizationRole(requiredRole: OrganizationRole) {
  return ((req: Request, res: Response, next: NextFunction) => {
    const userRole = res.locals.userInfo.organizationRole;

    if (!userRole) {
      res.status(403).json({ message: 'No role found' });
      return;
    }

    if (!hasRequiredOrganizationRole(userRole, requiredRole)) {
      res.status(403).json({ message: 'Insufficient Permissions' });
      return;
    }

    next();
    return;
  }) as unknown as RequestHandler;
}
