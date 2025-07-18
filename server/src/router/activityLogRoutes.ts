import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  getAllLogs,
  getLogByTicketId,
  getLogByUserId,
} from '../controllers/activityController';
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { GlobalRole, ProjectRole } from '@prisma/client';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import { resolveProjectIdForTicketRoute } from '../middleware/ticketMiddleware/resolveProjectIdForTicketRoute';

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
  resolveProjectIdForTicketRoute(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.VIEWER),
  async (req: Request, res: Response): Promise<void> => {
    await getLogByTicketId(req, res, prisma);
  }
);

router.get(
  '/activity-logs/:userId/user',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getLogByUserId(req, res, prisma);
  }
);

export default router;
