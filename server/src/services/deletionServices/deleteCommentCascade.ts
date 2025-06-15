import { Request, Response } from 'express';
import { PrismaClient, AttachmentEntityType } from '@prisma/client';
import { generateEntityIdForLog } from '../../utilities/generateEntityIdForLog';
import { buildLogEvent } from '../buildLogEvent';
import path from 'path';
import fs from 'fs/promises';

// Comments may have attachments associated with them. The attachment and associated record must be deleted.

export async function deleteCommentCascade(
  req: Request,
  res: Response,
  prisma: PrismaClient,
  commentId: number
) {
  try {
    const attachments = await prisma.attachment.findMany({
      where: { entityType: AttachmentEntityType.COMMENT, entityId: commentId },
    });

    // The comment has no associated attachments => Nothing to delete
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

    await prisma.attachment.deleteMany({
      where: { entityType: AttachmentEntityType.COMMENT },
    });

    const logEvents = deletedAttachments.map((attachment) => {
      const logEntityId = generateEntityIdForLog(
        attachment.entityType,
        attachment.entityId
      );

      return buildLogEvent({
        userId: attachment.uploadedBy,
        actorType: 'USER',
        action: 'DELETE_ATTACHMENT-COMMENT_DELETION',
        targetId: attachment.id,
        targetType: 'ATTACHMENT',
        metadata: {
          fileName: attachment.fileName,
          fileType: attachment.entityType,
          fileSize: attachment.fileSize,
          filePath: attachment.filePath,
          fileUrl: attachment.fileUrl,
          storageType: attachment.storageType,
          commentId: commentId,
        },
        ticketId: logEntityId.ticketId,
        boardId: logEntityId.boardId,
        projectId: logEntityId.projectId,
      });
    });

    res.locals.logEvents = (res.locals.logEvents || []).concat(logEvents);
    return;
  } catch (error) {
    console.error('Error while deleting attachments to comment', error);
    return;
  }
}
