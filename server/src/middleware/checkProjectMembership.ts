import { Request, Response, NextFunction } from 'express';
import { ProjectRole } from '@prisma/client';

type UserProject = {
  projectId: number;
  projectRole: ProjectRole;
};

export function checkProjectMembership(options?: {
  allowGlobalSuperAdmin?: boolean;
}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const userId = res.locals.userInfo?.id;
      const userProjects = res.locals.userProjects; // User project associations
      const isSuperAdmin: boolean = res.locals.isGlobalSuperAdmin;

      const { projectId } = req.params || req.body; // For ProjectMember specific selections
      const requestedProjectId =
        res.locals.projectId || parseInt(projectId, 10);

      if (!userId) {
        res.status(403).json({ message: 'No User Id defined' });
        return;
      }

      // SuperAdmin bypass check

      if (options?.allowGlobalSuperAdmin && isSuperAdmin) {
        next();
      }

      if (!userProjects) {
        res
          .status(403)
          .json({ message: 'User does not belong to any projects' });
        return;
      }

      const userProjectIds: number[] = userProjects.map(
        (userProject: UserProject) => userProject.projectId
      );

      if (!userProjectIds?.includes(requestedProjectId)) {
        res.status(403).json({ message: 'Forbidden: Not a project member' });
        return;
      }

      // The specific user information pertaining to requestedProjectId
      const projectProfile = userProjects.find(
        (userProject: UserProject) =>
          userProject.projectId === requestedProjectId
      );

      res.locals.userProjectDetails = projectProfile;

      next();
    } catch (error) {
      console.error('Auth Error:', error);
      res.status(500).json({ message: 'Server error during auth check' });
      return;
    }
  };
}
