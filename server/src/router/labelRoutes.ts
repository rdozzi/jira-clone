import { Router, Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import prisma from '../lib/prisma';
import {
  getAllLabels,
  createNewLabel,
  updateLabel,
  deleteLabel,
} from '../controllers/labelController';
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { GlobalRole } from '@prisma/client';

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
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await createNewLabel(req as CustomRequest, res, next, prisma);
  }
);

// Update Label
router.patch(
  '/labels/:labelId',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await updateLabel(req as CustomRequest, res, next, prisma);
  }
);

// Delete Label
router.delete(
  '/labels/:labelId',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteLabel(req as CustomRequest, res, next, prisma);
  }
);

export default router;
