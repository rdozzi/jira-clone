import { Router, Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/CustomRequest';
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
router.get('/boards', async (req: Request, res: Response): Promise<void> => {
  await getAllBoards(req, res, prisma);
});

// Get board by Id
router.get(
  '/boards/:id',
  async (req: Request, res: Response): Promise<void> => {
    await getBoardById(req, res, prisma);
  }
);
// Get boards by Project Id
router.get(
  '/boards/:projectId/project',
  async (req: Request, res: Response): Promise<void> => {
    await getBoardsByProjectId(req, res, prisma);
  }
);

// Create board
router.post(
  '/boards',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await createBoard(req as CustomRequest, res, next, prisma);
  }
);

// Update board
router.patch(
  '/boards/:boardId',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await updateBoard(req as CustomRequest, res, next, prisma);
  }
);

// Delete board
router.delete(
  '/boards/:boardId',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteBoard(req as CustomRequest, res, next, prisma);
  }
);

export default router;
