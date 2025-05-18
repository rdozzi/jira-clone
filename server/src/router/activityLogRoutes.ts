import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  getAllLogs,
  getLogbyTicketId,
  getLogbyUserId,
} from '../controllers/activityController';

const router = Router();

// Get all logs
router.get(
  '/activity-logs/all',
  async (req: Request, res: Response): Promise<void> => {
    await getAllLogs(req, res, prisma);
  }
);

router.get(
  '/activity-logs/:ticketId/ticket',
  async (req: Request, res: Response): Promise<void> => {
    await getLogbyTicketId(req, res, prisma);
  }
);

router.get(
  '/activity-logs/:userId/user',
  async (req: Request, res: Response): Promise<void> => {
    await getLogbyUserId(req, res, prisma);
  }
);

export default router;
