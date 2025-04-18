import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Get all Tickets
router.get('/tickets', async (req: Request, res: Response): Promise<void> => {
  try {
    const tickets = await prisma.ticket.findMany({
      relationLoadStrategy: 'query',
      include: {
        assignee: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets: ', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get all Tickets by Id
router.get(
  '/tickets/:id',
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const tickets = await prisma.ticket.findUnique({
        where: { id: Number(id) },
      });
      res.status(200).json(tickets);
    } catch (error) {
      console.error('Error fetching tickets: ', error);
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  }
);

// Get all Tickets by User Id
router.get(
  '/tickets/assigneeId/:userId',
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    console.log(userId);
    try {
      const tickets = await prisma.ticket.findMany({
        where: { assigneeId: Number(userId) },
      });
      res.status(200).json(tickets);
    } catch (error) {
      console.log('Error fetching tickets: ', error);
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  }
);

// Create new ticket
router.post('/tickets', async (req: Request, res: Response): Promise<void> => {
  try {
    const ticketData = req.body;
    const ticket = await prisma.ticket.create({
      data: ticketData,
    });
    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error creating ticket: ', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Update a ticket
router.patch(
  '/tickets/updateTicket/:ticketId',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const ticketData = req.body;
      const { ticketId } = req.params;
      console.log(ticketId);
      const ticket = await prisma.ticket.update({
        where: { id: Number(ticketId) },
        data: {
          ...ticketData,
        },
      });
      res.status(200).json(ticket);
    } catch (error) {
      console.error('Error editing ticket: ', error);
      res.status(500).json({ error: 'Failed to edit ticket' });
    }
  }
);

// Delete ticket
router.delete(
  '/tickets/:id',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleteTicket = await prisma.ticket.delete({
        where: { id: Number(id) },
      });
      res.status(200).json(deleteTicket);
    } catch (error) {
      console.error('Error fetching tickets: ', error);
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  }
);

export default router;
