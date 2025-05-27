import { Router, Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import { GlobalRole, ProjectRole } from '@prisma/client';
import { authorizeGlobalRole } from '../middleware/authorizeGlobalRole';
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
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.VIEWER),
  async (req: Request, res: Response): Promise<void> => {
    await getBoardsByProjectId(req, res, prisma);
  }
);

// Create board
router.post(
  '/boards',
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await createBoard(req as CustomRequest, res, next, prisma);
  }
);

// Update board
router.patch(
  '/boards/:boardId',
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await updateBoard(req as CustomRequest, res, next, prisma);
  }
);

// Delete board
router.delete(
  '/boards/:boardId',
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteBoard(req as CustomRequest, res, next, prisma);
  }
);

export default router;
