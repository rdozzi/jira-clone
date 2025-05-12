import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../../services/buildLogEvent';

export async function deleteManyAttachments(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
): Promise<void> {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    res
      .status(400)
      .json({ error: 'Invalid request: No attachments Ids provided' });
    return;
  }

  try {
    const attachments = await prisma.attachment.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

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
      where: {
        id: {
          in: ids,
        },
      },
    });

    res.locals.logEvents = deletedAttachments.map((attachment) => {
      return buildLogEvent({
        userId: attachment.uploadedBy,
        actorType: 'USER',
        action: 'DELETE_ATTACHMENT',
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
    });

    res.status(200).json({ message: 'Attachments deleted successfully' });
    next();
  } catch (error) {
    console.error('Error deleting attachments: ', error);
    res.status(500).json({ error: 'Failed to delete attachments' });
  }
}
