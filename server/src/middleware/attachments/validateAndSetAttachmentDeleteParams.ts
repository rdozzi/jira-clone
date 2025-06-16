import { Request, Response, NextFunction } from 'express';
import { AttachmentEntityType } from '@prisma/client';

export function validateAndSetAttachmentDeleteParams(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { attachmentIds, entityId, entityType } = req.body;

  // Check if attachmentIds array is valid
  if (!Array.isArray(attachmentIds) || attachmentIds.length === 0) {
    res
      .status(400)
      .json({ error: 'Invalid request: No attachments Ids provided' });
    return;
  }

  const parsedAttachmentIds = attachmentIds.map((id) => parseInt(id, 10));

  // Check that the parsed results are actual numbers
  if (parsedAttachmentIds.some(isNaN)) {
    res.status(400).json({ error: 'Attachment Ids must be valid integers' });
    return;
  }

  const entityIdParsed = parseInt(entityId, 10);

  if (isNaN(entityIdParsed) || !entityIdParsed) {
    res.status(400).json({ error: 'The entity id is invalid' });
    return;
  }

  if (
    !entityType ||
    !Object.values(AttachmentEntityType).includes(entityType)
  ) {
    res.status(400).json({ error: 'The entity type is invalid' });
    return;
  }

  res.locals.attachmentIds = parsedAttachmentIds as number[];
  res.locals.entityId = entityId as number;
  res.locals.entityType = entityType as AttachmentEntityType;

  next();
  return;
}
