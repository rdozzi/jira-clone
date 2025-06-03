import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/CustomRequest';

export async function checkProjectMembership(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    const userGlobalRole = req.user?.globalRole;
    const userProjects = req.userProjects; // User project associations

    const { projectId } = req.params; // For ProjectMember specific selections
    const requestedProjectId = parseInt(projectId, 10);

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

    const userProjectIds = userProjects.map(
      (userProject) => userProject.projectId
    );

    if (!userProjectIds?.includes(requestedProjectId)) {
      res.status(403).json({ message: 'Forbidden: Not a project member' });
      return;
    }

    // The specific user information pertaining to requestedProjectId
    const projectProfile = userProjects.find(
      (project) => project.projectId === requestedProjectId
    );

    res.locals.userProjectDetails = projectProfile;
    res.locals.userGlobalRole = userGlobalRole;

    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ message: 'Server error during auth check' });
    return;
  }
}
