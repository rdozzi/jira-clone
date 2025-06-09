import { Response, NextFunction } from 'express';
import { CustomRequest } from '../../types/CustomRequest';
import { handleFileUpload } from '../../services/uploadService';
import { PrismaClient, AttachmentEntityType } from '@prisma/client';
import { validateEntityAndId } from '../../utilities/validateEntityAndId';
import { buildLogEvent } from '../../services/buildLogEvent';
import { generateEntityIdForLog } from '../../utilities/generateEntityIdForLog';

export async function handleSingleUpload(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
      });
    }
    const { entityType, entityId } = req.body;
    const uploadedBy = res.locals.userInfo.id;
    const entityIdParsed = parseInt(entityId, 10);

    const entityRecord = await validateEntityAndId(
      entityType as AttachmentEntityType,
      entityIdParsed,
      prisma
    );

    if (!entityRecord) {
      return res.status(404).json({
        message: `Record for entity: ${entityType} with id: ${entityId} was not found`,
      });
    }

    const logEntityId = generateEntityIdForLog(entityType, entityIdParsed);

    const metadata = await handleFileUpload(req.file as Express.Multer.File);

    const attachment = await prisma.attachment.create({
      data: {
        entityType,
        entityId: entityIdParsed,
        uploadedBy,
        fileName: metadata.filename,
        fileType: metadata.mimetype,
        fileSize: metadata.size,
        filePath: metadata.savedPath,
        fileUrl: metadata.cloudUrl,
        storageType: metadata.storageType,
      },
    });

    res.locals.logEvent = buildLogEvent({
      userId: attachment.uploadedBy,
      actorType: 'USER',
      action: 'CREATE_ATTACHMENT',
      targetId: attachment.id,
      targetType: 'ATTACHMENT',
      metadata: {
        metadata,
      },
      ticketId: logEntityId?.ticketId,
      boardId: logEntityId?.boardId,
      projectId: logEntityId?.projectId,
    });

    return res.status(201).json({
      message: 'File uploaded successfully',
      attachment,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'File upload failed',
      error: (error as Error).message,
    });
  }
}

export async function handleMultipleUpload(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({
      message: 'No files uploaded',
    });
  }

  try {
    const { entityType, entityId } = req.body;
    const uploadedBy = res.locals.userInfo.id;
    const entityIdParsed = parseInt(entityId, 10);

    const entityRecord = await validateEntityAndId(
      entityType as AttachmentEntityType,
      entityIdParsed,
      prisma
    );

    if (!entityRecord) {
      return res.status(404).json({
        message: `Record for entity: ${entityType} wit id: ${entityId} not found`,
      });
    }

    const logEntityId = generateEntityIdForLog(entityType, entityIdParsed);

    const createdAttachments = await Promise.all(
      files.map(async (file) => {
        const metadata = await handleFileUpload(file);
        const attachment = await prisma.attachment.create({
          data: {
            entityType,
            entityId: entityIdParsed,
            uploadedBy,
            fileName: metadata.filename,
            fileType: metadata.mimetype,
            fileSize: metadata.size,
            filePath: metadata.savedPath,
            fileUrl: metadata.cloudUrl,
            storageType: metadata.storageType,
          },
        });
        return attachment;
      })
    );

    res.locals.logEvents = createdAttachments.map((attachment) => {
      return buildLogEvent({
        userId: attachment.uploadedBy,
        actorType: 'USER',
        action: 'CREATE_ATTACHMENT',
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
        ticketId: logEntityId?.ticketId,
        boardId: logEntityId?.boardId,
        projectId: logEntityId?.projectId,
      });
    });

    return res.status(201).json({
      message: `${createdAttachments.length} uploaded successfully`,
      createdAttachments,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'File upload failed',
      error: (error as Error).message,
    });
  }
}
