import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  getAllLabels,
  createNewLabel,
  updateLabel,
  deleteLabel,
} from '../controllers/labelController';
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { GlobalRole } from '@prisma/client';
import { validateCreateLabel } from '../middleware/labelMiddleware/validateCreateLabel';

const router = Router();

// Get all Labels
router.get(
  '/labels',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllLabels(req, res, prisma);
  }
);

// Create new Label
router.post(
  '/labels',
  authorizeGlobalRole(GlobalRole.ADMIN),
  validateCreateLabel,
  async (req: Request, res: Response): Promise<void> => {
    await createNewLabel(req, res, prisma);
  }
);

// Update Label
router.patch(
  '/labels/:labelId',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await updateLabel(req, res, prisma);
  }
);

// Delete Label
router.delete(
  '/labels/:labelId',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await deleteLabel(req, res, prisma);
  }
);

export default router;
