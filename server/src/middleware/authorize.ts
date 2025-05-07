import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { hasRequiredRole } from '../lib/roles';

export function authorize(requiredRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ message: 'No role found' });
    }

    if (!hasRequiredRole(userRole, requiredRole)) {
      return res.status(403).json({ message: 'Insufficient Permissions' });
    }

    next();
  };
}
