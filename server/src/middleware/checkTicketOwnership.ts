import { RequestHandler } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import { PrismaClient } from '@prisma/client';

export function checkTicketOwnership(prisma: PrismaClient): RequestHandler {
  return async (req, res, next) => {
    const customReq = req as unknown as CustomRequest;

    const userId = customReq.user?.id;
    const userRole = customReq.user?.globalRole;
    const ticketId = parseInt(customReq.params.id, 10);

    // If the user is a SUPERADMIN, allow access to all comments
    if (userRole === 'SUPERADMIN') {
      return next();
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket || ticket.assigneeId !== userId) {
      res.status(403).json({ message: 'Forbidden: Not your ticket' });
      return;
    }
    next();
  };
}
