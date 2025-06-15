import { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma';

// Payloads include ticketId and commentId
export function resolveProjectIdFromComment() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticketIdRaw = req.params.ticketId || req.body.ticketId;

      if (ticketIdRaw) {
        const ticketId = parseInt(ticketIdRaw, 10);

        if (isNaN(ticketId)) {
          res.status(400).json({ message: 'Invalid ticket Id' });
          return;
        }

        const ticket = await prisma.ticket.findUnique({
          where: { id: ticketId },
          include: { board: { select: { projectId: true } } },
        });

        if (!ticket) {
          res.status(404).json({ message: 'Ticket not found' });
          return;
        }

        res.locals.projectId = ticket?.board?.projectId || null;
        next();
        return;
      }

      const commentIdRaw = req.params.commentId || req.body.commentId;
      const commentId = parseInt(commentIdRaw, 10);

      if (isNaN(commentId)) {
        res.status(400).json({ message: 'Invalid comment Id' });
        return;
      }

      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
          ticket: { include: { board: { select: { projectId: true } } } },
        },
      });

      if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }

      res.locals.projectId = comment?.ticket?.board?.projectId || null;
      next();
      return;
    } catch (error) {
      console.error('Error resolving projectId from comment or ticket:', error);
      next(error);
      return;
    }
  };
}
