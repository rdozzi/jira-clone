import { Request, Response, NextFunction } from 'express';
import { OrganizationRole } from '@prisma/client';

export function authorizeSelfOrAdminWithRoleCheck() {
  return (req: Request, res: Response, next: NextFunction) => {
    const { id: requestUserId, organizationRole: requestUserOrganizationRole } =
      res.locals.userInfo;
    const { userId } = req.params;
    const { organizationRole } = req.body;

    const userIdParsed = parseInt(userId as string, 10);
    const isAdmin =
      requestUserOrganizationRole === OrganizationRole.ADMIN ||
      requestUserOrganizationRole === OrganizationRole.SUPERADMIN;
    const isSelf = requestUserId === userIdParsed;

    // Authorization check
    if (!isSelf && !isAdmin) {
      res.status(403).json({ message: 'Forbidden: insufficient privileges' });
      return;
    }

    // Self role change prevention
    if (isSelf && organizationRole) {
      res
        .status(403)
        .json({ error: 'Unauthorized to change your own global role.' });
      return;
    }

    next();
  };
}
