import { Router, Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import prisma from '../lib/prisma';
import {
  getAllTickets,
  getTicketById,
  getTicketByAssigneeId,
  createNewTicket,
  updateTicket,
  deleteTicket,
} from '../controllers/ticketController';

const router = Router();

// Get all Tickets
router.get('/tickets', async (req: Request, res: Response): Promise<void> => {
  await getAllTickets(req, res, prisma);
});

// Get Ticket by Id
router.get(
  '/tickets/:id',
  async (req: Request, res: Response): Promise<void> => {
    await getTicketById(req, res, prisma);
  }
);

// Get all Tickets by User Id
router.get(
  '/tickets/assigneeId/:userId',
  async (req: Request, res: Response): Promise<void> => {
    await getTicketByAssigneeId(req, res, prisma);
  }
);

// Create new ticket
router.post(
  '/tickets',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await createNewTicket(req as CustomRequest, res, next, prisma);
  }
);

// Delete ticket
router.delete(
  '/tickets/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteTicket(req as CustomRequest, res, next, prisma);
  }
);

// Update a ticket
router.patch(
  '/tickets/updateTicket/:ticketId',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await updateTicket(req as CustomRequest, res, next, prisma);
  }
);

export default router;
