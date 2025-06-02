import { RequestHandler } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import { PrismaClient } from '@prisma/client';

export function checkCommentOwnership(prisma: PrismaClient): RequestHandler {
  return async (req, res, next) => {
    const customReq = req as unknown as CustomRequest;

    const userId = customReq.user?.id;
    const userRole = customReq.user?.globalRole;
    const commentId = parseInt(customReq.params.id, 10);

    // If the user is a SUPERADMIN, allow access to all comments
    if (userRole === 'SUPERADMIN') {
      return next();
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.authorId !== userId) {
      res.status(403).json({ message: 'Forbidden: Not your comment' });
      return;
    }
    next();
  };
}
