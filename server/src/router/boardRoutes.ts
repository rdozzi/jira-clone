import { Router, Request, Response, NextFunction } from 'express';
import { GlobalRole, ProjectRole } from '@prisma/client';
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import prisma from '../lib/prisma';
import {
  getAllBoards,
  getBoardById,
  getBoardsByProjectId,
  createBoard,
  updateBoard,
  deleteBoard,
} from '../controllers/boardController';

const router = Router();

// Get all Boards
router.get(
  '/boards',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllBoards(req, res, prisma);
  }
);

// Get board by Id
router.get(
  '/boards/:id',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getBoardById(req, res, prisma);
  }
);
// Get boards by Project Id
router.get(
  '/boards/:projectId/project',
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.VIEWER, { allowGlobalSuperAdmin: true }),
  async (req: Request, res: Response): Promise<void> => {
    await getBoardsByProjectId(req, res, prisma);
  }
);

// Create board
router.post(
  '/boards',
  checkProjectMembership(),
  checkProjectRole(ProjectRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await createBoard(req, res, next, prisma);
  }
);

// Update board
router.patch(
  '/boards/:boardId',
  checkProjectMembership(),
  checkProjectRole(ProjectRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await updateBoard(req, res, next, prisma);
  }
);

// Delete board
router.delete(
  '/boards/:boardId',
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.ADMIN, { allowGlobalSuperAdmin: true }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteBoard(req, res, next, prisma);
  }
);

export default router;
