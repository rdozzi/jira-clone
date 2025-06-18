import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  getAllBannedEmails,
  getBannedEmailById,
  createBannedEmail,
} from '../controllers/bannedEmailController';
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { GlobalRole } from '@prisma/client';

const router = Router();

// Get all banned emails
router.get(
  '/bannedEmails/all',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllBannedEmails(req, res, prisma);
  }
);

// Get banned email by Id
router.get(
  '/bannedEmails/:bannedEmailId',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getBannedEmailById(req, res, prisma);
  }
);

// Create banned email
router.post(
  '/bannedEmails',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await createBannedEmail(req, res, prisma);
  }
);

export default router;
