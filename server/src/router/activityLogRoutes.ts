import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  getAllRoutes,
  getRoutebyTicketId,
  getRoutebyUserId,
} from '../controllers/activityController';

const router = Router();

// Get all logs
router.get(
  '/activity-logs/all',
  async (req: Request, res: Response): Promise<void> => {
    await getAllRoutes(req, res, prisma);
  }
);

router.get(
  '/activity-logs/:ticketId/ticket',
  async (req: Request, res: Response): Promise<void> => {
    await getRoutebyTicketId(req, res, prisma);
  }
);

router.get(
  '/activity-logs/:userId/user',
  async (req: Request, res: Response): Promise<void> => {
    await getRoutebyUserId(req, res, prisma);
  }
);

export default router;
