import { Request, Response, NextFunction } from 'express';
import { handleFileUpload } from '../../services/uploadService';
import { PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../../services/buildLogEvent';

export async function handleSingleUpload(
  req: Request,
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
    const uploadedBy = (req as any).user?.id || 1; // Will be replaced with the logged-in user ID eventually
    const metadata = await handleFileUpload(req.file as Express.Multer.File);

    const attachment = await prisma.attachment.create({
      data: {
        entityType,
        entityId: Number(entityId),
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
      ticketId: attachment.entityId,
      boardId: null,
      projectId: null,
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      attachment,
    });
    next();
  } catch (error) {
    res.status(500).json({
      message: 'File upload failed',
      error: (error as Error).message,
    });
  }
}

export async function handleMultipleUpload(
  req: Request,
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
    const uploadedBy = (req as any).user?.id || 1; // Will be replaced with the logged-in user ID eventually

    const createdAttachments = await Promise.all(
      files.map(async (file) => {
        const metadata = await handleFileUpload(file);
        const attachment = await prisma.attachment.create({
          data: {
            entityType,
            entityId: Number(entityId),
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
        ticketId: attachment.entityId,
        boardId: null,
        projectId: null,
      });
    });

    res.status(201).json({
      message: `${createdAttachments.length} uploaded successfully`,
      createdAttachments,
    });
    next();
  } catch (error) {
    res.status(500).json({
      message: 'File upload failed',
      error: (error as Error).message,
    });
  }
}
