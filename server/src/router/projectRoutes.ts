import { Router, Request, Response } from 'express';
import { GlobalRole, ProjectRole } from '@prisma/client';
import { resolveProjectIdFromProject } from '../middleware/projectMiddleware/resolveProjectIdFromProject';
import prisma from '../lib/prisma';

import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';

// Middleware
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';

const router = Router();

// Get all projects
router.get(
  '/projects',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllProjects(req, res, prisma);
  }
);

// Get project by Id
router.get(
  '/projects/:projectId',
  resolveProjectIdFromProject(),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.VIEWER, { allowGlobalSuperAdmin: true }),
  async (req: Request, res: Response): Promise<void> => {
    await getProjectById(req, res, prisma);
  }
);

// Create project (Become a member of project)
router.post(
  '/projects',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await createProject(req, res, prisma);
  }
);

// Update project
router.patch(
  '/projects/:projectId',
  resolveProjectIdFromProject(),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.ADMIN, { allowGlobalSuperAdmin: true }),
  async (req: Request, res: Response): Promise<void> => {
    await updateProject(req, res, prisma);
  }
);

// Delete project
router.delete(
  '/projects/:projectId',
  resolveProjectIdFromProject(),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.ADMIN, { allowGlobalSuperAdmin: true }),
  async (req: Request, res: Response): Promise<void> => {
    await deleteProject(req, res, prisma);
  }
);

export default router;
