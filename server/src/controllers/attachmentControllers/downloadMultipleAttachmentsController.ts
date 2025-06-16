import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import axios from 'axios';
import { generateSignedCloudUrl } from '../../utilities/generateSignedCloudUrl';
import { PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../../services/buildLogEvent';
import { generateEntityIdForLog } from '../../utilities/generateEntityIdForLog';

export async function downloadMultipleAttachments(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    // Variables derived from validateAndSetAttachmentDeleteParams
    const attachmentIds = res.locals.attachmentIds;
    const entityId = res.locals.entityId;
    const entityType = res.locals.entityType;

    if (!Array.isArray(attachmentIds) || attachmentIds.length === 0) {
      res.status(400).json({ error: 'No attachment Ids provided.' });
      return;
    }
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

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=attachments-${Date.now()}.zip`
    );
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });
    archive.pipe(res);

    const attachmentLogEntityIds = attachments.map((attachment) =>
      generateEntityIdForLog(attachment.entityType, attachment.entityId)
    );

    for (const attachment of attachments) {
      const { filePath, fileUrl, fileName, storageType } = attachment;

      if (storageType === 'LOCAL') {
        const fullpath = path.resolve(filePath || '');
        if (fs.existsSync(fullpath)) {
          archive.file(fullpath, { name: fileName });
        } else {
          console.warn('Local file not found: ${fullpath}');
        }
      } else if (storageType === 'CLOUD') {
        try {
          const signedUrl = await generateSignedCloudUrl({
            fileUrl: fileUrl || '',
          });
          const response = await axios.get(signedUrl, {
            responseType: 'stream',
          });
          archive.append(response.data, { name: fileName });
        } catch (error) {
          console.error('Error downloading file from cloud: ', error);
          res.status(500).json({ error: 'Failed to download file' });
          return;
        }
      }
    }

    res.locals.logEvents = attachments.map((attachment, index) => {
      const logEntityId = attachmentLogEntityIds[index];

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
        ticketId: logEntityId.ticketId,
        boardId: logEntityId.boardId,
        projectId: logEntityId.projectId,
      });
    });

    archive.finalize();
    return;
  } catch (error) {
    console.error('Download Error:', error);
    res.status(500).json({ message: 'Failed to download attachments:', error });
  }
}
