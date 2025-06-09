import { Router, Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import prisma from '../lib/prisma';
import { GlobalRole, ProjectRole } from '@prisma/client';
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import {
  getAllTickets,
  getTicketById,
  getTicketByAssigneeId,
  createNewTicket,
  updateTicket,
  deleteTicket,
  getTicketsByBoardId,
} from '../controllers/ticketController';
import { checkTicketOwnership } from '../middleware/checkTicketOwnership';

const router = Router();

// Get all Tickets
router.get(
  '/tickets',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllTickets(req, res, prisma);
  }
);

// Get Ticket by Id
router.get(
  '/tickets/:id',
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getTicketById(req, res, prisma);
  }
);

// Get all Tickets by User Id
router.get(
  '/tickets/assigneeId/:userId',
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.USER),
  async (req: Request, res: Response): Promise<void> => {
    await getTicketByAssigneeId(req, res, prisma);
  }
);

// Get Tickets by Board Id
router.get(
  '/tickets/:boardId/board',
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.VIEWER),
  async (req: Request, res: Response): Promise<void> => {
    await getTicketsByBoardId(req, res, prisma);
  }
);

// Create new ticket
router.post(
  '/tickets',
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.USER),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await createNewTicket(req as CustomRequest, res, next, prisma);
  }
);

// Delete ticket
router.delete(
  '/tickets/:id',
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.USER),
  checkTicketOwnership(prisma),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteTicket(req as CustomRequest, res, next, prisma);
  }
);

// Update a ticket
router.patch(
  '/tickets/updateTicket/:id',
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.USER),
  checkTicketOwnership(prisma),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await updateTicket(req as CustomRequest, res, next, prisma);
  }
);

export default router;
