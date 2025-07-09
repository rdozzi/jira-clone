import { Request, Response } from 'express';
import path from 'path';
import { generateSignedCloudUrl } from '../../utilities/generateSignedCloudUrl';
import { Attachment } from '@prisma/client';
import { buildLogEvent } from '../../services/buildLogEvent';
import { generateEntityIdForLog } from '../../utilities/generateEntityIdForLog';

export async function downloadSingleAttachment(req: Request, res: Response) {
  try {
    const attachment: Attachment = res.locals.attachment;

    if (attachment.storageType === 'LOCAL') {
      const filePath = path.resolve(attachment.filePath || '');
      res.locals.logEvent = generatePayload(attachment);
      return res.download(filePath, attachment.fileName);
    } else if (attachment.storageType === 'CLOUD') {
      const signedUrl = await generateSignedCloudUrl(attachment);
      res.locals.logEvent = generatePayload(attachment);
      res.status(200).json({
        message: `Download Successful; ${signedUrl} created successfully`,
      });
    } else {
      res.status(400).json({ error: 'Invalid storage type' });
      return;
    }
  } catch (error) {
    console.error('Error downloading attachment: ', error);
    res.status(500).json({ error: 'Failed to download attachment' });
    return;
  }
}

function generatePayload(attachment: Attachment) {
  const logEntityId = generateEntityIdForLog(
    attachment.entityType,
    attachment.entityId
  );

  return buildLogEvent({
    userId: attachment.uploadedBy,
    actorType: 'USER',
    action: 'DOWNLOAD_ATTACHMENT',
    targetId: attachment.id,
    targetType: 'ATTACHMENT',
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
}
