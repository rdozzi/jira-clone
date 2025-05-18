import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  getAllRoutes,
  getRoutebyTicketId,
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
  '/activity-logs/:ticketId',
  async (req: Request, res: Response): Promise<void> => {
    await getRoutebyTicketId(req, res, prisma);
  }
);
export default router;
