import { Request, Response, NextFunction } from 'express';
import { AttachmentEntityType } from '@prisma/client';
import prisma from '../../lib/prisma';

// Route level middleware to get the project id for all entities except user. The project id will then allow for association and authorization checks at the project level.

export async function checkEntityType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { attachmentId } = req.params;
    const attachmentIdParsed = parseInt(attachmentId, 10);

    if (isNaN(attachmentIdParsed)) {
      return res.status(400).json({
        message: 'Invalid attachment ID',
      });
    }

    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentIdParsed },
    });

    if (!attachment) {
      return res.status(404).json({
        message: 'Attachment not found',
      });
    }

    switch (attachment.entityType) {
      case AttachmentEntityType.TICKET:
        req.body.entityType = 'TICKET';
        break;
      case AttachmentEntityType.COMMENT:
        req.body.entityType = 'COMMENT';
        break;
      case AttachmentEntityType.BOARD:
        req.body.entityType = 'BOARD';
        break;
      case AttachmentEntityType.PROJECT:
        req.body.entityType = 'PROJECT';
        break;
      case AttachmentEntityType.USER:
        req.body.entityType = 'USER';
        break;
      default:
        return res.status(400).json({
          message: 'Unsupported entity type',
        });
    }
    next();
  } catch (error) {
    console.error('Error checking entity type: ', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: (error as Error).message,
    });
  }
}
