import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all comments
router.get('/comments', async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await prisma.comment.findMany();
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments: ', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Get comments for a specific ticket
router.get(
  '/comments/:ticketId',
  async (req: Request, res: Response): Promise<void> => {
    const { ticketId } = req.params;
    try {
      const ticketComments = await prisma.comment.findMany({
        where: { ticketId: Number(ticketId) },
      });
      res.status(200).json(ticketComments);
    } catch (error) {
      console.error('Error fetching comments: ', error);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }
);

// Create a comment
router.post('/comments', async (req: Request, res: Response): Promise<void> => {
  try {
    const commentData = req.body;
    const comment = await prisma.comment.create({
      data: commentData,
    });
    res.status(200).json(comment);
  } catch (error) {
    console.error('Error creating comment: ', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});
export default router;

// Delete comment
router.delete(
  '/comments/:id',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleteComment = await prisma.comment.delete({
        where: { id: Number(id) },
      });
      res.status(200).json(deleteComment);
    } catch (error) {
      console.error('Error fetching tickets: ', error);
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  }
);

// Update comment
router.patch(
  '/comments/:commentId',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { content } = req.body;
      const { commentId } = req.params;
      console.log(commentId);

      if (typeof content !== 'string' || content.trim() === '') {
        res.status(400).json({
          error: 'Content is required and must be a non-empty string.',
        });
        return;
      }

      const updateComment = await prisma.comment.update({
        where: { id: Number(commentId) },
        data: {
          content,
        },
      });
      res.status(200).json(updateComment);
    } catch (error) {
      console.error('Error editing comment: ', error);
      res.status(500).json({ error: 'Failed to edit comment' });
    }
  }
);
