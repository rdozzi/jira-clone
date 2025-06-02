import { Request, Response, NextFunction } from 'express';
import { GlobalRole, ProjectRole } from '@prisma/client';
import { hasRequiredProjectRole } from '../lib/roles';

export function checkProjectRole(requiredRole: ProjectRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = res.locals.userRole as GlobalRole | undefined;

    if (userRole === GlobalRole.SUPERADMIN) {
      return next();
    }

    const userProjectInfo:
      | {
          projectId: number;
          projectRole: ProjectRole;
        }
      | undefined = res.locals.userProjectDetails;

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
