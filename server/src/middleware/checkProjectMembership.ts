import { Request, Response, NextFunction } from 'express';
import { GlobalRole, ProjectRole } from '@prisma/client';
import { resolveProjectIdFromEntity } from '../utilities/resolveProjectIdFromEntity';

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
      const userId = res.locals.userInfo?.id;
      const userProjects = res.locals.userProjects; // User project associations
      const globalRole = res.locals.userInfo.globalRole;

      let projectId = req.params.projectId || req.body.projectId;

      if (!projectId) {
        const { boardId } = req.params;

        projectId = await resolveProjectIdFromEntity(
          'BOARD',
          parseInt(boardId, 10)
        );
      }
      const requestedProjectId = parseInt(projectId, 10);

      if (!userId) {
        res.status(403).json({ message: 'No User Id defined' });
        return;
      }

      // SuperAdmin bypass check
      if (
        options?.allowGlobalSuperAdmin &&
        globalRole === GlobalRole.SUPERADMIN
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
    } catch (error) {
      console.error('Auth Error:', error);
      res.status(500).json({ message: 'Server error during auth check' });
      return;
    }
  };
}
