import { Request, Response, NextFunction } from 'express';
import { AttachmentEntityType } from '@prisma/client';
import prisma from '../../lib/prisma';
import { getProjectIdByTicket } from '../../utilities/getProjectIDByEntityUtilities/getProjectIdByTicket';
import { getProjectIdByBoard } from '../../utilities/getProjectIDByEntityUtilities/getProjectByBoard';
import { getProjectIdByComment } from '../../utilities/getProjectIDByEntityUtilities/getProjectByComment';

// Route level middleware to get the project id for all entities except user. The project id will then allow for association and authorization checks at the project level. User entities will have logic that isn't related to projects.

export async function checkEntityType(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { entityId } = req.params;
    const entityIdParsed = parseInt(entityId, 10);

    if (isNaN(entityIdParsed)) {
      res.status(400).json({
        message: 'Invalid attachment ID',
      });
      return;
    }

    const attachment = await prisma.attachment.findUnique({
      where: { id: entityIdParsed },
    });

    if (!attachment) {
      res.status(404).json({
        message: 'Attachment not found',
      });
      return;
    }

    let projectId;

    switch (attachment.entityType) {
      case AttachmentEntityType.TICKET:
        projectId = getProjectIdByTicket(entityIdParsed, prisma);
        break;
      case AttachmentEntityType.COMMENT:
        projectId = getProjectIdByComment(entityIdParsed, prisma);
        break;
      case AttachmentEntityType.BOARD:
        projectId = getProjectIdByBoard(entityIdParsed, prisma);
        break;
      case AttachmentEntityType.PROJECT:
        // ProjectId is directly related to attachmentId
        projectId = entityIdParsed;
        break;
      case AttachmentEntityType.USER:
        res.locals.isUserAttachment = true; //No project related checks necessary
        break;
      default:
        res.status(400).json({
          message: 'Unsupported entity type',
        });
        return;
    }

    res.locals.projectId = projectId; // This res.locals.projectId goes to checkProjectMembership

    next();
  } catch (error) {
    console.error('Error checking entity type: ', error);
    res.status(500).json({
      message: 'Internal server error',
      error: (error as Error).message,
    });
    return;
  }
}
