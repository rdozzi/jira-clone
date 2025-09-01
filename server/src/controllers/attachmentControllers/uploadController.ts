import { Response, NextFunction } from 'express';
import { CustomRequest } from '../../types/CustomRequest';
import { handleFileUpload } from '../../services/uploadService';
import { PrismaClient, AttachmentEntityType, Attachment } from '@prisma/client';
import { validateEntityAndId } from '../../utilities/validateEntityAndId';
import { buildLogEvent } from '../../services/buildLogEvent';
import { generateEntityIdForLog } from '../../utilities/generateEntityIdForLog';
import { createResourceService } from '../../services/organizationUsageServices/createResourceService';
import { FileMetadata } from '../../types/file';
import { logBus } from '../../lib/logBus';

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
    const { entityType, entityId } = res.locals.validatedBody;
    const uploadedBy = res.locals.userInfo.id;
    const organizationId = res.locals.userInfo.organizationId;
    const resourceType = res.locals.resourceType;

    const entityRecord = await validateEntityAndId(
      entityType as AttachmentEntityType,
      entityId,
      prisma
    );

    if (!entityRecord) {
      return res.status(404).json({
        message: `Record for entity: ${entityType} with id: ${entityId} was not found`,
      });
    }

    const logEntityId = generateEntityIdForLog(entityType, entityId);

    const fileMetadata: FileMetadata = await handleFileUpload(
      req.file as Express.Multer.File
    );

    const attachment = await createResourceService(
      prisma,
      resourceType,
      organizationId,
      async (tx) =>
        await tx.attachment.create({
          data: {
            entityType,
            entityId: entityId,
            uploadedBy,
            fileName: fileMetadata.filename,
            fileType: fileMetadata.mimetype,
            fileSize: fileMetadata.size,
            filePath: fileMetadata.savedPath,
            fileUrl: fileMetadata.cloudUrl,
            storageType: fileMetadata.storageType,
            organizationId: organizationId,
          },
        }),
      fileMetadata.size
    );

    const logEvents = [
      buildLogEvent({
        userId: attachment.uploadedBy,
        actorType: 'USER',
        action: 'CREATE_ATTACHMENT',
        targetId: attachment.id,
        targetType: 'ATTACHMENT',
        organizationId: organizationId,
        metadata: {
          ...fileMetadata,
          ...(logEntityId.commentId && { commentId: logEntityId.commentId }),
          ...(logEntityId.ticketId && { ticketId: logEntityId.ticketId }),
          ...(logEntityId.boardId && { boardId: logEntityId.boardId }),
          ...(logEntityId.projectId && { projectId: logEntityId.projectId }),
        },
      }),
    ];

    logBus.emit('activityLog', logEvents);

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
    const { entityType, entityId } = res.locals.validatedBody;
    const uploadedBy = res.locals.userInfo.id;
    const organizationId = res.locals.userInfo.organizationId;
    const resourceType = res.locals.resourceType;

    const entityRecord = await validateEntityAndId(
      entityType as AttachmentEntityType,
      entityId,
      prisma
    );

    if (!entityRecord) {
      return res.status(404).json({
        message: `Record for entity: ${entityType} wit id: ${entityId} not found`,
      });
    }

    const logEntityId = generateEntityIdForLog(entityType, entityId);

    const createdAttachments: Attachment[] = [];

    let fileMetadata: FileMetadata;

    for (const file of files) {
      fileMetadata = await handleFileUpload(file);
      const attachment = await createResourceService(
        prisma,
        resourceType,
        organizationId,
        async (tx) =>
          await tx.attachment.create({
            data: {
              entityType,
              entityId: entityId,
              uploadedBy,
              fileName: fileMetadata.filename,
              fileType: fileMetadata.mimetype,
              fileSize: fileMetadata.size,
              filePath: fileMetadata.savedPath,
              fileUrl: fileMetadata.cloudUrl,
              storageType: fileMetadata.storageType,
              organizationId: organizationId,
            },
          })
      );

      createdAttachments.push(attachment);
    }

    const logEvents = createdAttachments.map((attachment) => {
      return buildLogEvent({
        userId: attachment.uploadedBy,
        actorType: 'USER',
        action: 'CREATE_ATTACHMENT',
        targetId: attachment.id,
        targetType: 'ATTACHMENT',
        organizationId: organizationId,
        metadata: {
          ...fileMetadata,
          ...(logEntityId.commentId && { commentId: logEntityId.commentId }),
          ...(logEntityId.ticketId && { ticketId: logEntityId.ticketId }),
          ...(logEntityId.boardId && { boardId: logEntityId.boardId }),
          ...(logEntityId.projectId && { projectId: logEntityId.projectId }),
        },
      });
    });

    logBus.emit('activityLog', logEvents);

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
