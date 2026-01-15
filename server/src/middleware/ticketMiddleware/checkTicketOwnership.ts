import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

export function checkTicketOwnership(prisma: PrismaClient): RequestHandler {
  return async (req, res, next) => {
    const userId = res.locals.userInfo.id;
    const userRole = res.locals.userInfo.globalRole;
    const { ticketId } = req.params;

    if (!ticketId) {
      res.status(400).json({ message: 'Invalid ticket id' });
    }
    const ticketIdParsed = parseInt(ticketId as string, 10);

    // If the user is a SUPERADMIN, allow access to all comments
    if (userRole === 'SUPERADMIN') {
      return next();
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketIdParsed },
    });

    if (!ticket || ticket.assigneeId !== userId) {
      res.status(403).json({ message: 'Forbidden: Not your ticket' });
      return;
    }
    next();
  };
}
