import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  getAllProjects,
  getProjectById,
  createProject,
  deleteProject,
} from '../controllers/projectController';

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
router.post('/projects', async (req: Request, res: Response): Promise<void> => {
  await createProject(req, res, prisma);
});

// Delete project
router.delete(
  '/projects/:id',
  async (req: Request, res: Response): Promise<void> => {
    await deleteProject(req, res, prisma);
  }
);

export default router;
