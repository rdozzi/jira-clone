import { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma';

export function resolveProjectIdForTicketRoute() {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { ticketId, boardId: boardIdParam } = req.params;
      const boardId = boardIdParam ?? req.body.boardId;

      if (ticketId) {
        const ticketIdParsed = parseInt(ticketId, 10);
        if (isNaN(ticketIdParsed)) {
          res.status(400).json({ message: 'Invalid ticket ID' });
          return;
        }

        const ticket = await prisma.ticket.findUnique({
          where: { id: ticketIdParsed },
          include: { board: { select: { projectId: true } } },
        });

        if (!ticket) {
          res.status(404).json({ message: 'Ticket not found' });
          return;
        }

        res.locals.projectId = ticket.board?.projectId;
        res.locals.ticketId = ticketIdParsed;
        return next();
      }

      if (boardId) {
        const boardIdParsed = parseInt(boardId, 10);
        if (isNaN(boardIdParsed)) {
          res.status(400).json({ message: 'Invalid board ID' });
          return;
        }

        const board = await prisma.board.findUnique({
          where: { id: boardIdParsed },
          select: { projectId: true },
        });

        if (!board) {
          res.status(404).json({ message: 'Board not found' });
          return;
        }

        res.locals.projectId = board.projectId;
        return next();
      }

      res.status(400).json({ message: 'No ticket ID or board ID provided' });
    } catch (error) {
      console.error('Error resolving project ID from ticket:', error);
      res
        .status(500)
        .json({ message: 'Server error while resolving project ID' });
      return;
    }
  };
}
