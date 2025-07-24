import { Response, NextFunction } from 'express';
import { CustomRequest } from '../../types/CustomRequest';
import fs from 'fs/promises';
import { PrismaClient, Attachment } from '@prisma/client';
import { generateEntityIdForLog } from '../../utilities/generateEntityIdForLog';
import { buildLogEvent } from '../../services/buildLogEvent';

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
      // Improve for safety later
      const filePath = attachment?.filePath;

      if (filePath) {
        await fs.unlink(filePath);
      } else {
        throw new Error('File path is missing for local attachment.');
      }
    } else if (storageType === 'CLOUD') {
      // await saveToCloud.deleteFile(attachment.path);
      console.log('Deleting from cloud storage:', attachment?.filePath);
      // Implement the logic to delete the file from cloud storage (Eventua lly!)
    }

    const logEntityId = generateEntityIdForLog(
      attachment.entityType,
      attachment.entityId
    );

    // Delete DB Record
    await prisma.attachment.delete({
      where: { id: attachment?.id },
    });

    res.locals.logEvent = buildLogEvent({
      userId: deletedAttachment.uploadedBy,
      actorType: 'USER',
      action: 'DELETE_ATTACHMENT',
      targetId: deletedAttachment.id,
      targetType: 'ATTACHMENT',
      organizationId: organizationId,
      metadata: {
        fileName: deletedAttachment.fileName,
        fileType: deletedAttachment.entityType,
        fileSize: deletedAttachment.fileSize,
        filePath: deletedAttachment.filePath,
        fileUrl: deletedAttachment.fileUrl,
        storageType: deletedAttachment.storageType,
        ...(logEntityId.commentId && { commentId: logEntityId.commentId }),
        ...(logEntityId.ticketId && { ticketId: logEntityId.ticketId }),
        ...(logEntityId.boardId && { boardId: logEntityId.boardId }),
        ...(logEntityId.projectId && { projectId: logEntityId.projectId }),
      },
    });

    res.status(200).json({ message: 'Attachment deleted successfully' });
    next();
  } catch (error) {
    console.error('Error deleting attachment: ', error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
}
