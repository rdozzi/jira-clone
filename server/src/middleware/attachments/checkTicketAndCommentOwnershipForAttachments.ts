import { Request, Response, NextFunction } from 'express';
import { AttachmentEntityType, OrganizationRole } from '@prisma/client';
import prisma from '../../lib/prisma';

export async function checkTicketOrCommentOwnershipForAttachments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const entityType: AttachmentEntityType = res.locals.entityType;
    const entityId: number = parseInt(res.locals.entityId, 10);
    const userId: number = parseInt(res.locals.userInfo.id, 10);
    const userGlobalRole = res.locals.userInfo.globalRole;

    //If user is a SuperAdmin or the entityType is neither ticket or comment, go next
    if (userGlobalRole === OrganizationRole.SUPERADMIN) {
      next();
      return;
    } else if (
      entityType !== AttachmentEntityType.TICKET &&
      entityType !== AttachmentEntityType.COMMENT
    ) {
      next();
      return;
    }
    //If ticket, check if assigneeId === res.locals.userInfo.id, fail auth if not, next if so

    if (entityType === AttachmentEntityType.TICKET) {
      const ticket = await prisma.ticket.findFirst({
        where: { id: entityId },
      });

      if (!ticket) {
        res.status(404).json({ message: 'Ticket not found.' });
        return;
      }

      if (ticket?.assigneeId !== userId) {
        res.status(401).json({ message: 'You do not own this ticket' });
        return;
      }

      return next();
    }

    //If comment, check if authorId === res.locals.userInfo.id, fail auth if not, next if so
    else if (entityType === AttachmentEntityType.COMMENT) {
      const comment = await prisma.comment.findFirst({
        where: { id: entityId },
      });

      if (!comment) {
        res.status(404).json({ message: 'Comment not found.' });
        return;
      }

      if (comment?.authorId !== userId) {
        res.status(401).json({ message: 'You do not own this comment' });
        return;
      }

      return next();
    }
  } catch (error) {
    console.error('Error checking for ticket or comment ownership:', error);
    res.status(500).json({
      message: `Error checking for ticket or comment ownership ${error}`,
    });
    return;
  }
}
