import { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../../services/buildLogEvent';

export async function deleteAttachment(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
): Promise<void> {
  console.log('Deleting attachment controller...');
  try {
    const attachment = req.attachment;
    const deletedAttachment = { ...req.attachment };
    const storageType = attachment.storageType;
    if (storageType === 'LOCAL') {
      const filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'uploads',
        attachment.filePath
      );
      await fs.unlink(filePath);
    } else if (storageType === 'CLOUD') {
      // await saveToCloud.deleteFile(attachment.path);
      console.log('Deleting from cloud storage:', attachment.path);
      // Implement the logic to delete the file from cloud storage (Eventually!)
    }

    // Delete DB Record
    await prisma.attachment.delete({
      where: { id: attachment.id },
    });

    res.locals.logEvent = buildLogEvent({
      userId: deletedAttachment.uploadedBy,
      actorType: 'USER',
      action: 'DELETE_ATTACHMENT',
      targetId: deletedAttachment.id,
      targetType: 'ATTACHMENT',
      metadata: {
        fileName: deletedAttachment.fileName,
        fileType: deletedAttachment.entityType,
        fileSize: deletedAttachment.fileSize,
        filePath: deletedAttachment.filePath,
        fileUrl: deletedAttachment.fileUrl,
        storageType: deletedAttachment.storageType,
      },
      ticketId: deletedAttachment.entityId,
      boardId: null,
      projectId: null,
    });

    res.status(200).json({ message: 'Attachment deleted successfully' });
    next();
  } catch (error) {
    console.error('Error deleting attachment: ', error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
}
