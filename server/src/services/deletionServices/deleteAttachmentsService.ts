import { Response } from 'express';
import { Prisma, AttachmentEntityType } from '@prisma/client';
import { generateEntityIdForLog } from '../../utilities/generateEntityIdForLog';
import { buildLogEvent } from '../buildLogEvent';
import path from 'path';
import fs from 'fs/promises';
import { logBus } from '../../lib/logBus';

export async function deleteAttachmentsService(
  res: Response,
  tx: Prisma.TransactionClient,
  entityType: AttachmentEntityType,
  entityId: number,
  userId: number,
  organizationId: number
) {
  const attachments = await tx.attachment.findMany({
    where: {
      entityType: entityType,
      entityId: entityId,
      organizationId: organizationId,
    },
  });

  // The entityType (and corresponding id) has no associated attachments => Nothing to delete
  if (attachments.length === 0) return;

  const deletedAttachments: typeof attachments = JSON.parse(
    JSON.stringify(attachments)
  );

  for (const attachment of attachments) {
    try {
      if (attachment.storageType === 'LOCAL') {
        const filePath = path.resolve(attachment.filePath || '');
        await fs.unlink(filePath);
      } else if (attachment.storageType === 'CLOUD') {
        // await saveToCloud.deleteFile(attachment.path);
        console.log('Deleting from cloud storage:', attachment.fileUrl);
      }
    } catch (error) {
      console.error(
        `Failed to delete file for attachment ${attachment.filePath}:`,
        error
      );
    }
  }

  await tx.attachment.deleteMany({
    where: { entityType: entityType, entityId: entityId },
  });

  const logEvents = deletedAttachments.map((attachment) => {
    const logEntityId = generateEntityIdForLog(entityType, entityId);

    return buildLogEvent({
      userId: userId,
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

  logBus.emit('activityLog', logEvents);
  return;
}
