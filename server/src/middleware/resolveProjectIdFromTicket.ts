import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export async function resolveProjectIdFromTicket(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ticketId } = req.params;
    const ticketIdParse = parseInt(ticketId, 10);

    if (isNaN(ticketIdParse)) {
      res.status(400).json({ message: 'Invalid ticket ID' });
      return;
    }

    // Assuming you have a function to get the project ID from the ticket ID
    const ticketWithProjectRef = await prisma.ticket.findUnique({
      where: { id: ticketIdParse },
      include: { board: { select: { projectId: true } } },
    });

    if (!ticketWithProjectRef || !ticketWithProjectRef.board) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    res.locals.projectId = ticketWithProjectRef.board.projectId;

    next();
  } catch (error) {
    console.error('Error resolving project ID from ticket:', error);
    res
      .status(500)
      .json({ message: 'Server error while resolving project ID' });
    return;
  }
}
