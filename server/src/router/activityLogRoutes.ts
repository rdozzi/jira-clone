import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  getAllLogs,
  getLogbyTicketId,
  getLogbyUserId,
} from '../controllers/activityController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { GlobalRole } from '@prisma/client';

const router = Router();

// Get all logs
router.get(
  '/activity-logs/all',
  authenticate,
  authorize(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllLogs(req, res, prisma);
  }
);

router.get(
  '/activity-logs/:ticketId/ticket',
  authenticate,
  authorize(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getLogbyTicketId(req, res, prisma);
  }
);

router.get(
  '/activity-logs/:userId/user',
  authenticate,
  authorize(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getLogbyUserId(req, res, prisma);
  }
);

export default router;
