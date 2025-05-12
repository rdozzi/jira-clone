import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import {
  getAllBannedEmails,
  getBannedEmailById,
  createBannedEmail,
} from '../controllers/bannedEmailController';

const router = Router();

// Get all banned emails
router.get(
  '/bannedEmails/all',
  async (req: Request, res: Response): Promise<void> => {
    await getAllBannedEmails(req, res, prisma);
  }
);

// Get banned email by Id
router.get(
  '/bannedEmails/:id',
  async (req: Request, res: Response): Promise<void> => {
    await getBannedEmailById(req, res, prisma);
  }
);

// Create banned email
router.post(
  '/bannedEmails',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await createBannedEmail(req, res, next, prisma);
  }
);

export default router;
