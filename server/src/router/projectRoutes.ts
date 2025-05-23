import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import { authorizeGlobalRole } from '../middleware/authorizeGlobalRole';
import { GlobalRole } from '@prisma/client';
import { CustomRequest } from '../types/CustomRequest';

const router = Router();

// Get all projects
router.get('/projects', async (req: Request, res: Response): Promise<void> => {
  await getAllProjects(req, res, prisma);
});

// Get project by Id
router.get(
  '/projects/:id',
  async (req: Request, res: Response): Promise<void> => {
    await getProjectById(req, res, prisma);
  }
);

// Create project
router.post(
  '/projects',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await createProject(req as CustomRequest, res, next, prisma);
  }
);

// Update project
router.patch(
  '/projects/:id',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await updateProject(req as CustomRequest, res, next, prisma);
  }
);

// Delete project
router.delete(
  '/projects/:id',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteProject(req, res, next, prisma);
  }
);

export default router;
