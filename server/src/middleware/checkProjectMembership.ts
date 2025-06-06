import { Request, Response, NextFunction } from 'express';
import { ProjectRole } from '@prisma/client';

type UserProject = {
  projectId: number;
  projectRole: ProjectRole;
};

export async function checkProjectMembership(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = res.locals.userInfo?.id;
    const userGlobalRole = res.locals.userInfo?.globalRole;
    const userProjects = res.locals.userProjects; // User project associations

    const { projectId } = req.params; // For ProjectMember specific selections
    const requestedProjectId = res.locals.projectId || parseInt(projectId, 10);

    if (!userId) {
      res.status(403).json({ message: 'No User Id defined' });
      return;
    }

    // If the user is a SUPERADMIN, allow access to all tickets
    if (userGlobalRole === 'SUPERADMIN') {
      res.locals.userGlobalRole = userGlobalRole;
      res.locals.userId = userId;
      return next();
    }

    if (!userProjects) {
      res.status(403).json({ message: 'User does not belong to any projects' });
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
      (userProject: UserProject) => userProject.projectId === requestedProjectId
    );

    res.locals.userProjectDetails = projectProfile;

    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ message: 'Server error during auth check' });
    return;
  }
}
