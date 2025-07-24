import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  getAllBannedEmails,
  getBannedEmailById,
  createBannedEmail,
} from '../controllers/bannedEmailController';
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { OrganizationRole } from '@prisma/client';
import { validateParams } from '../middleware/validation/validateParams';
import { bannedEmailCreateSchema } from '../schemas/bannedEmail.schema';
import { validateBody } from '../middleware/validation/validateBody';

const router = Router();

// Get all banned emails
router.get(
  '/bannedEmails',
  authorizeGlobalRole(OrganizationRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllBannedEmails(req, res, prisma);
  }
);

// Get banned email by Id
router.get(
  '/bannedEmails/:bannedEmailId',
  authorizeGlobalRole(OrganizationRole.ADMIN),
  validateParams,
  async (req: Request, res: Response): Promise<void> => {
    await getBannedEmailById(req, res, prisma);
  }
);

// Create banned email
router.post(
  '/bannedEmails',
  authorizeGlobalRole(OrganizationRole.ADMIN),
  validateBody(bannedEmailCreateSchema),
  async (req: Request, res: Response): Promise<void> => {
    await createBannedEmail(req, res, prisma);
  }
);

export default router;
