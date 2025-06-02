import { Response, NextFunction, RequestHandler } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import prisma from '../lib/prisma';

async function loadUserProjectsFn(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.globalRole) {
      console.error('User role missing in user object');
      res.status(500).json({ message: 'User role is missing.' });
      return;
    }

    if (req.user?.globalRole === 'SUPERADMIN') {
      return next();
    }

    const projectMemberships = await prisma.projectMember.findMany({
      where: { userId: req.user?.id },
      select: { projectId: true, projectRole: true },
    });

    req.userProjects = projectMemberships.map((m) => {
      return { projectId: m.projectId, projectRole: m.projectRole };
    });
    next();
  } catch (error) {
    console.error('Error loading user projects: ', error);
    res
      .status(500)
      .json({ message: 'Server error loading project membership' });
    return;
  }
}

export const loadUserProjects = loadUserProjectsFn as unknown as RequestHandler;
