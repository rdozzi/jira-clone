import { NextFunction, Response } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import { PrismaClient } from '@prisma/client';

export function checkAttachmentOwnership(prisma: PrismaClient) {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const attachmentId = parseInt(req.params.id, 10);
    const userId = req.user?.id;

    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment || attachment.uploadedBy !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not our attachment' });
    }
    next();
  };
}

export function checkMultipleAttachmentOwnerShip(prisma: PrismaClient) {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const attachmentIds: number[] = req.body.ids;

    if (!Array.isArray(attachmentIds) || attachmentIds.length === 0) {
      return res
        .status(400)
        .json({ message: 'Attachment Ids must be a non-empty array' });
    }

    const attachments = await prisma.attachment.findMany({
      where: { id: { in: attachmentIds } },
    });

    const unauthorized = attachments.find((att) => att.uploadedBy !== userId);

    if (unauthorized) {
      return res.status(403).json({
        message: `Forbidden: You do not have permission to delete attachment ID ${unauthorized.id}`,
      });
    }
    next();
  };
}
