import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import {
  getAllLabels,
  createNewLabel,
  updateLabel,
  deleteLabel,
} from '../controllers/labelController';
import { authorize } from '../middleware/authorize';
import { GlobalRole } from '@prisma/client';

const router = Router();

// Get all Labels
router.get('/labels', async (req: Request, res: Response): Promise<void> => {
  await getAllLabels(req, res, prisma);
});

// Create new Label
router.post(
  '/labels',
  authorize(GlobalRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await createNewLabel(req, res, next, prisma);
  }
);

// Update Label
router.patch(
  '/labels/:labelId',
  authorize(GlobalRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await updateLabel(req, res, next, prisma);
  }
);

// Delete Label
router.delete(
  '/labels/:labelId',
  authorize(GlobalRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteLabel(req, res, next, prisma);
  }
);

export default router;
