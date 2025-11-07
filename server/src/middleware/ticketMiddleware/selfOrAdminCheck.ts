import { Request, Response, NextFunction } from 'express';
import { OrganizationRole } from '@prisma/client';

export function selfOrAdminCheck() {
  return (req: Request, res: Response, next: NextFunction) => {
    const { id: requestUserId, organizationRole } = res.locals.userInfo;
    const { userId } = req.params;

    const userIdParsed = parseInt(userId, 10);
    const isAdmin =
      organizationRole === OrganizationRole.ADMIN ||
      organizationRole === OrganizationRole.SUPERADMIN;
    const isSelf = requestUserId === userIdParsed;

    // Authorization check
    if (!isSelf && !isAdmin) {
      res.status(403).json({ message: 'Forbidden: insufficient privileges' });
      return;
    }

    next();
  };
}
