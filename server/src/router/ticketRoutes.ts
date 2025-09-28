import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { OrganizationRole, ProjectRole } from '@prisma/client';
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import {
  getAllTickets,
  getTicketById,
  // getTicketByAssigneeId,
  createNewTicket,
  updateTicket,
  deleteTicket,
  getTicketsByBoardId,
} from '../controllers/ticketController';
import { checkTicketOwnership } from '../middleware/ticketMiddleware/checkTicketOwnership';
import { resolveProjectIdForTicketRoute } from '../middleware/ticketMiddleware/resolveProjectIdForTicketRoute';
import { validateParams } from '../middleware/validation/validateParams';
import { validateBody } from '../middleware/validation/validateBody';
import {
  ticketCreateSchema,
  ticketUpdateSchema,
} from '../schemas/ticket.schema';
import { validateQuery } from '../middleware/validation/validateQuery';
import { checkMaxUsageTotals } from '../middleware/organizationUsageMiddleware/checkMaxUsageTotals';

const router = Router();

// Get all Tickets
router.get(
  '/tickets',
  authorizeGlobalRole(OrganizationRole.ADMIN),
  validateQuery,
  async (req: Request, res: Response): Promise<void> => {
    await getAllTickets(req, res, prisma);
  }
);

// Get Ticket by Id
router.get(
  '/tickets/:ticketId',
  resolveProjectIdForTicketRoute(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.USER),
  validateParams,
  async (req: Request, res: Response): Promise<void> => {
    await getTicketById(req, res, prisma);
  }
);

// Get all Tickets by User Id
// Deprecated. Use get all ticket params with query to get tickets for specific users by assigneeId or reporterId.
// router.get(
//   '/tickets/:userId/assigneeId',
//   resolveProjectIdForTicketRoute(),
//   checkProjectMembership(),
//   checkProjectRole(ProjectRole.USER),
//   async (req: Request, res: Response): Promise<void> => {
//     await getTicketByAssigneeId(req, res, prisma);
//   }
// );

// Get Tickets by Board Id
router.get(
  '/tickets/:boardId/board',
  resolveProjectIdForTicketRoute(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.VIEWER),
  validateParams,
  async (req: Request, res: Response): Promise<void> => {
    await getTicketsByBoardId(req, res, prisma);
  }
);

// Create new ticket
router.post(
  '/tickets',
  resolveProjectIdForTicketRoute(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.USER),
  validateBody(ticketCreateSchema),
  checkMaxUsageTotals(prisma),
  async (req: Request, res: Response): Promise<void> => {
    await createNewTicket(req, res, prisma);
  }
);

// Delete ticket
router.delete(
  '/tickets/:ticketId',
  resolveProjectIdForTicketRoute(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.USER),
  checkTicketOwnership(prisma),
  validateParams,
  async (req: Request, res: Response): Promise<void> => {
    await deleteTicket(req, res, prisma);
  }
);

// Update a ticket
router.patch(
  '/tickets/:ticketId/update',
  resolveProjectIdForTicketRoute(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.USER),
  checkTicketOwnership(prisma),
  validateParams,
  validateBody(ticketUpdateSchema),
  async (req: Request, res: Response): Promise<void> => {
    await updateTicket(req, res, prisma);
  }
);

export default router;
