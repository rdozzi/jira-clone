import { Request, Response, NextFunction } from 'express';
import { GlobalRole, ProjectRole } from '@prisma/client';
import { hasRequiredProjectRole } from '../lib/roles';

export function checkProjectRole(
  requiredRole: ProjectRole,
  options?: { allowGlobalSuperAdmin?: boolean }
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userProjectInfo:
      | {
          projectId: number;
          projectRole: ProjectRole;
        }
      | undefined = res.locals.userProjectDetails;

    const globalRole = res.locals.userInfo.globalRole;

    if (
      options?.allowGlobalSuperAdmin &&
      globalRole === GlobalRole.SUPERADMIN
    ) {
      return next();
    }

    if (!userProjectInfo) {
      res
        .status(403)
        .json({ message: 'Forbidden: Not a member of this project' });
      return;
    }

    const userProjectRole = userProjectInfo.projectRole;

    if (!hasRequiredProjectRole(userProjectRole, requiredRole)) {
      res
        .status(403)
        .json({ message: 'Forbidden: Insufficient project role.' });
      return;
    }

    next();
  };
}
