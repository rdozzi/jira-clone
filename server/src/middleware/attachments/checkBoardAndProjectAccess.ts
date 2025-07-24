import { Request, Response, NextFunction } from 'express';
import {
  AttachmentEntityType,
  ProjectRole,
  OrganizationRole,
} from '@prisma/client';
import prisma from '../../lib/prisma';

export async function checkBoardAndProjectAccess(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const entityType = res.locals.entityType;
    const projectId = res.locals.projectId;
    const userId = res.locals.userInfo.id;
    const userGlobalRole = res.locals.userInfo.globalRole;

    if (userGlobalRole === OrganizationRole.SUPERADMIN) {
      next();
      return;
    } else if (
      entityType === AttachmentEntityType.BOARD ||
      entityType === AttachmentEntityType.PROJECT
    ) {
      const projectMember = await prisma.projectMember.findUnique({
        where: { userId_projectId: { userId, projectId } },
      });

      if (!projectMember) {
        res.status(404).json({
          message: 'Record not found. User is not a member of this project',
        });
        return;
      }

      if (projectMember.projectRole !== ProjectRole.ADMIN) {
        res.status(403).json({
          message: 'Forbidden action. Not a project administrator.',
        });
        return;
      }
    }
    next();
  } catch (error) {
    console.error('Could not check privilege:', error);
    res.status(500).json({ message: `Could not check privilege: ${error}` });
    return;
  }
}
