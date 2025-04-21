import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { getAllBoards } from '../controllers/boardController';

const router = Router();

// Get all Boards
router.get('/boards/', async (req: Request, res: Response): Promise<void> => {
  await getAllBoards(req, res, prisma);
});

// Get board by Id
// Get boards by Project Id
// Create board
// Update board
// Delete board

export default router;
