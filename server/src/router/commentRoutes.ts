import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  getAllComments,
  getAllCommentsById,
  createComment,
  deleteComment,
  updateComment,
} from '../controllers/commentController';

const router = Router();

// Get all comments
router.get('/comments', async (req: Request, res: Response): Promise<void> => {
  await getAllComments(req, res, prisma);
});

// Get comments for a specific ticket
router.get(
  '/comments/:ticketId',
  async (req: Request, res: Response): Promise<void> => {
    await getAllCommentsById(req, res, prisma);
  }
);

// Create a comment
router.post('/comments', async (req: Request, res: Response): Promise<void> => {
  await createComment(req, res, prisma);
});

// Delete comment
router.delete(
  '/comments/:id',
  async (req: Request, res: Response): Promise<void> => {
    await deleteComment(req, res, prisma);
  }
);

// Update comment
router.patch(
  '/comments/:commentId',
  async (req: Request, res: Response): Promise<void> => {
    await updateComment(req, res, prisma);
  }
);

export default router;
