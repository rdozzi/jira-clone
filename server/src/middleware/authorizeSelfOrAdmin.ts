import { RequestHandler, Request, Response, NextFunction } from 'express';
import { GlobalRole } from '@prisma/client';

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: GlobalRole;
  };
}

export function authorizeSelfOrAdmin(): RequestHandler {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const requestUserId = req.user?.id;
    const requestUserRole = req.user?.role;
    const targetUserId = parseInt(req.params.id, 10);

    if (
      requestUserId === targetUserId ||
      requestUserRole === GlobalRole.ADMIN ||
      requestUserRole === GlobalRole.SUPERADMIN
    ) {
      return next();
    }

    res.status(403).json({ message: 'Forbidden: insufficient privileges' });
  };
}
