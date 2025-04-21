import { Router, Request, Response } from 'express';
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
router.post('/boards', async (req: Request, res: Response): Promise<void> => {
  await createBoard(req, res, prisma);
});

// Update board
router.patch(
  '/boards/:boardId',
  async (req: Request, res: Response): Promise<void> => {
    await updateBoard(req, res, prisma);
  }
);

// Delete board
router.delete(
  '/boards/:boardId',
  async (req: Request, res: Response): Promise<void> => {
    await deleteBoard(req, res, prisma);
  }
);

export default router;
