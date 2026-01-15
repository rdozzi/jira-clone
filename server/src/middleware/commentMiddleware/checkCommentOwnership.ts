import { Request, Response, NextFunction } from 'express';
import { OrganizationRole } from '@prisma/client';
import prisma from '../../lib/prisma';

export function checkCommentOwnership(options?: {
  allowOrganizationSuperAdmin?: boolean;
}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const commentId = parseInt(req.params.commentId as string, 10);

    if (!commentId || isNaN(commentId)) {
      res.status(400).json({ message: 'Invalid comment Id' });
      return;
    }

    const userId = res.locals.userInfo.id;
    const organizationRole = res.locals.userInfo.organizationRole;

    // SuperAdmin bypass check
    if (
      options?.allowOrganizationSuperAdmin &&
      organizationRole === OrganizationRole.SUPERADMIN
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
