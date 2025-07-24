import { Request, Response, NextFunction } from 'express';
import { OrganizationRole } from '@prisma/client';
import prisma from '../../lib/prisma';

export function checkCommentOwnership(options?: {
  allowGlobalSuperAdmin?: boolean;
}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const commentId = parseInt(req.params.commentId, 10);

    if (!commentId || isNaN(commentId)) {
      res.status(400).json({ message: 'Invalid comment Id' });
      return;
    }

    const userId = res.locals.userInfo.id;
    const globalRole = res.locals.userInfo.globalRole;

    // SuperAdmin bypass check
    if (
      options?.allowGlobalSuperAdmin &&
      globalRole === OrganizationRole.SUPERADMIN
    ) {
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
