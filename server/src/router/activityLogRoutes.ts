import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  getAllLogs,
  getLogbyTicketId,
  getLogbyUserId,
} from '../controllers/activityController';
import { authorizeGlobalRole } from '../middleware/authorizeGlobalRole';
import { GlobalRole, ProjectRole } from '@prisma/client';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import { resolveProjectIdFromTicket } from '../middleware/resolveProjectIdFromTicket';

const router = Router();

// Get All logs
router.get(
  '/activity-logs/all',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllLogs(req, res, prisma);
  }
);

// Get Logs by TicketId
router.get(
  '/activity-logs/:ticketId/ticket',
  resolveProjectIdFromTicket,
  checkProjectMembership,
  checkProjectRole(ProjectRole.VIEWER),
  async (req: Request, res: Response): Promise<void> => {
    await getLogbyTicketId(req, res, prisma);
  }
);

router.get(
  '/activity-logs/:userId/user',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getLogbyUserId(req, res, prisma);
  }
);

export default router;
