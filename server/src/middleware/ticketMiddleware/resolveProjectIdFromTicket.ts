import { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma';

export function resolveProjectIdFromTicket() {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { ticketId } = req.params;

      if (!ticketId) {
        res.status(400).json({ message: 'No ticket Id provided' });
      }

      const ticketIdParse = parseInt(ticketId, 10);

      if (isNaN(ticketIdParse)) {
        res.status(400).json({ message: 'Invalid ticket ID' });
        return;
      }

      // Join tables to get projectId
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketIdParse },
        include: { board: { select: { projectId: true } } },
      });

      if (!ticket) {
        res.status(404).json({ message: 'Ticket not found' });
        return;
      }

      res.locals.projectId = ticket?.board?.projectId as number;
      res.locals.ticketId = ticketIdParse as number;

      next();
      return;
    } catch (error) {
      console.error('Error resolving project ID from ticket:', error);
      res
        .status(500)
        .json({ message: 'Server error while resolving project ID' });
      return;
    }
  };
}
