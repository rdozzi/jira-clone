import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { PrismaClient } from '@prisma/client';
import { generateEntityIdForLog } from '../../utilities/generateEntityIdForLog';
import { buildLogEvent } from '../../services/buildLogEvent';
import { deleteResourceService } from '../../services/organizationUsageServices/deleteResourceService';

export async function deleteManyAttachments(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
): Promise<void> {
  // Variables derived from validateAndSetAttachmentDeleteParams
  const attachmentIds = res.locals.attachmentIds;
  const entityId = res.locals.entityId;
  const entityType = res.locals.entityType;
  const organizationId = res.locals.userInfo.organizationId;

  try {
    const attachments = await prisma.attachment.findMany({
      where: {
        id: {
          in: attachmentIds,
        },
        entityType,
        entityId,
      },
    });

    if (attachments.length !== attachmentIds.length) {
      res.status(403).json({
        message: 'One or more attachments do not match the specified entity.',
      });
      return;
    }

    const attachmentLogEntityIds = attachments.map((attachment) =>
      generateEntityIdForLog(attachment.entityType, attachment.entityId)
    );

    const deletedAttachments: typeof attachments = JSON.parse(
      JSON.stringify(attachments)
    );

    for (const attachment of attachments) {
      try {
        if (attachment.storageType === 'LOCAL') {
          const filePath = path.resolve(attachment.filePath || '');
          await fs.unlink(filePath);
          await deleteResourceService(prisma, organizationId, async (tx) =>
            tx.attachment.delete({ where: { id: attachment.id } })
          );
        } else if (attachment.storageType === 'CLOUD') {
          // await saveToCloud.deleteFile(attachment.path);
          console.log('Deleting from cloud storage:', attachment.fileUrl);
        }
      } catch (error) {
        res.status(500).json({
          message: `Failed to delete file for attachment ${attachment.filePath}: ${error}`,
          error: error instanceof Error ? error.message : String(error),
        });
        return;
      }
    }

    res.locals.logEvents = deletedAttachments.map((attachment, index) => {
      const logEntityId = attachmentLogEntityIds[index];

      return buildLogEvent({
        userId: attachment.uploadedBy,
        actorType: 'USER',
        action: 'DELETE_ATTACHMENT',
        targetId: attachment.id,
        targetType: 'ATTACHMENT',
        organizationId: organizationId,
        metadata: {
          fileName: attachment.fileName,
          fileType: attachment.entityType,
          fileSize: attachment.fileSize,
          filePath: attachment.filePath,
          fileUrl: attachment.fileUrl,
          storageType: attachment.storageType,
          ...(logEntityId.commentId && { commentId: logEntityId.commentId }),
          ...(logEntityId.ticketId && { ticketId: logEntityId.ticketId }),
          ...(logEntityId.boardId && { boardId: logEntityId.boardId }),
          ...(logEntityId.projectId && { projectId: logEntityId.projectId }),
        },
      });
    });

    res.status(200).json({ message: 'Attachments deleted successfully' });
    next();
  } catch (error) {
    console.error('Error deleting attachments: ', error);
    res.status(500).json({ error: 'Failed to delete attachments' });
  }
}
