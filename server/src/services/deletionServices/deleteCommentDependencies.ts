import { Response } from 'express';
import { Prisma, AttachmentEntityType } from '@prisma/client';
import { deleteAttachmentsService } from './deleteAttachmentsService';

// Comments may have attachments associated with them. The attachment and associated record must be deleted.

export async function deleteCommentDependencies(
  res: Response,
  tx: Prisma.TransactionClient,
  commentEntity: AttachmentEntityType, // COMMENT
  commentId: number,
  userId: number
) {
  await deleteAttachmentsService(
    res,
    tx,
    commentEntity, // COMMENT
    commentId,
    userId
  );
}
