import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  getAllLabels,
  createNewLabel,
  updateLabel,
  deleteLabel,
} from '../controllers/labelController';
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { OrganizationRole } from '@prisma/client';
import { validateCreateLabel } from '../middleware/labelMiddleware/validateCreateLabel';
import { validateUpdateLabel } from '../middleware/labelMiddleware/validateUpdateLabel';
import { validateParams } from '../middleware/validation/validateParams';

const router = Router();

// Get all Labels
router.get(
  '/labels',
  authorizeGlobalRole(OrganizationRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllLabels(req, res, prisma);
  }
);

// Create new Label
router.post(
  '/labels',
  authorizeGlobalRole(OrganizationRole.ADMIN),
  validateCreateLabel,
  async (req: Request, res: Response): Promise<void> => {
    await createNewLabel(req, res, prisma);
  }
);

// Update Label
router.patch(
  '/labels/:labelId',
  authorizeGlobalRole(OrganizationRole.ADMIN),
  validateUpdateLabel,
  validateParams,
  async (req: Request, res: Response): Promise<void> => {
    await updateLabel(req, res, prisma);
  }
);

// Delete Label
router.delete(
  '/labels/:labelId',
  authorizeGlobalRole(OrganizationRole.ADMIN),
  validateParams,
  async (req: Request, res: Response): Promise<void> => {
    await deleteLabel(req, res, prisma);
  }
);

export default router;
