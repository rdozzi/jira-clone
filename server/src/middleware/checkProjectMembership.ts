import { Request, Response, NextFunction } from 'express';
import { OrganizationRole, ProjectRole } from '@prisma/client';

type UserProject = {
  projectId: number;
  projectRole: ProjectRole;
};

export function checkProjectMembership(options?: {
  allowGlobalSuperAdmin?: boolean;
}) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // User id and globalRole from storeUserAndProjectInfo
      const userId = res.locals.userInfo?.id;
      const globalRole = res.locals.userInfo.globalRole;
      // User project associations from loadUserProjects
      const userProjects = res.locals.userProjects;
      // Current projectId from resolveProjectIdFor[route]
      const projectId = res.locals.projectId;

      const requestedProjectId = parseInt(projectId, 10);

      if (!userId) {
        res.status(403).json({ message: 'No User Id defined' });
        return;
      }

      // SuperAdmin bypass check
      if (
        options?.allowGlobalSuperAdmin &&
        globalRole === OrganizationRole.SUPERADMIN
      ) {
        return next();
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
      return;
    } catch (error) {
      console.error('Auth Error:', error);
      res.status(500).json({ message: 'Server error during auth check' });
      return;
    }
  };
}
