import { Request, Response, NextFunction } from 'express';
import { Attachment } from '@prisma/client';

export function loadEntityIdAndEntityTypeForSingleDeletion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // This comes from validateAttachmentExistsAndStore
  const attachment: Attachment = res.locals.attachment;

  res.locals.entityId = attachment.entityId;
  res.locals.entityType = attachment.entityType;

  next();
  return;
}
