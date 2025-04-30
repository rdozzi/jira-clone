import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { generateSignedCloudUrl } from '../../utilities/generateSignedCloudUrl';
import { PrismaClient, Attachment } from '@prisma/client';
import { buildLogEvent } from '../../services/buildLogEvent';

export async function downloadSingleAttachment(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  const attachmentId = Number(req.params.id);
  console.log(attachmentId);
  try {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    if (attachment.storageType === 'LOCAL') {
      const filePath = path.resolve(attachment.filePath || '');
      res.locals.logEvent = generatePayload(attachment);
      return res.download(filePath, attachment.fileName);
      next();
    } else if (attachment.storageType === 'CLOUD') {
      const signedUrl = await generateSignedCloudUrl(attachment);
      res.locals.logEvent = generatePayload(attachment);
      res.status(201).json({
        message: `Signed URL generated successfully: ${signedUrl}`,
      });
      next();
    } else {
      res.status(400).json({ error: 'Invalid storage type' });
    }
  } catch (error) {
    console.error('Error downloading attachment: ', error);
    res.status(500).json({ error: 'Failed to download attachment' });
  }
}

function generatePayload(attachment: Attachment) {
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
    },
    ticketId: attachment.entityId,
    boardId: null,
    projectId: null,
  });
}
