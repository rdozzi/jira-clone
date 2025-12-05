import { Response, NextFunction } from 'express';
import { CustomRequest } from '../../types/CustomRequest';
import fs from 'fs/promises';
import { PrismaClient, Attachment } from '@prisma/client';
import { generateEntityIdForLog } from '../../utilities/generateEntityIdForLog';
import { buildLogEvent } from '../../services/buildLogEvent';
import { deleteResourceService } from '../../services/organizationUsageServices/deleteResourceService';
import { FileMetadata } from '../../types/file';
import { logBus } from '../../lib/logBus';
import { deleteFromCloud } from '../../utilities/deleteFromCloud';

export async function deleteAttachment(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
): Promise<void> {
  try {
    const attachment: Attachment = res.locals.attachment;
    const deletedAttachment: Attachment = { ...attachment };
    const storageType = attachment?.storageType;
    const organizationId = res.locals.userInfo.organizationId;
    if (storageType === 'LOCAL') {
      const filePath = attachment?.filePath;
      if (filePath) {
        await fs.unlink(filePath);
      } else {
        throw new Error('File path is missing for local attachment.');
      }
    } else if (storageType === 'CLOUD') {
      if (!attachment.fileUrl) {
        throw new Error('No attachment key present');
      }
      const filenameKey = attachment.fileUrl;
      console.log('Deleting from cloud storage:', attachment?.fileName);
      await deleteFromCloud(filenameKey);
    }

    const logEntityId = generateEntityIdForLog(
      attachment.entityType,
      attachment.entityId
    );

    // Delete DB Record
    await deleteResourceService(prisma, organizationId, async (tx) =>
      tx.attachment.delete({
        where: { id: attachment?.id },
      })
    );

    const fileMetadata: FileMetadata = {
      filename: deletedAttachment.fileName,
      mimetype: deletedAttachment.entityType,
      size: deletedAttachment.fileSize,
      savedPath: deletedAttachment.filePath ?? undefined,
      fileUrl: deletedAttachment.fileUrl ?? undefined,
      storageType: deletedAttachment.storageType,
    };

    const logEvents = [
      buildLogEvent({
        userId: deletedAttachment.uploadedBy,
        actorType: 'USER',
        action: 'DELETE_ATTACHMENT',
        targetId: deletedAttachment.id,
        targetType: 'ATTACHMENT',
        organizationId: organizationId,
        metadata: {
          ...fileMetadata,
          ...(logEntityId.commentId && { commentId: logEntityId.commentId }),
          ...(logEntityId.ticketId && { ticketId: logEntityId.ticketId }),
          ...(logEntityId.boardId && { boardId: logEntityId.boardId }),
          ...(logEntityId.projectId && { projectId: logEntityId.projectId }),
        },
      }),
    ];

    logBus.emit('activityLog', logEvents);

    res.status(200).json({ message: 'Attachment deleted successfully' });
    next();
  } catch (error) {
    console.error('Error deleting attachment: ', error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
}
