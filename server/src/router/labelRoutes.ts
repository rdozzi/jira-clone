import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  getAllLabels,
  createNewLabel,
  updateLabel,
  deleteLabel,
} from '../controllers/labelController';

const router = Router();

// Get all Labels
router.get('/labels', async (req: Request, res: Response): Promise<void> => {
  await getAllLabels(req, res, prisma);
});

// Create new Label
router.post('/labels', async (req: Request, res: Response): Promise<void> => {
  await createNewLabel(req, res, prisma);
});

// Update Label
router.patch(
  '/labels/:labelId',
  async (req: Request, res: Response): Promise<void> => {
    await updateLabel(req, res, prisma);
  }
);

// Delete Label
router.delete(
  '/labels/:labelId',
  async (req: Request, res: Response): Promise<void> => {
    await deleteLabel(req, res, prisma);
  }
);

export default router;
