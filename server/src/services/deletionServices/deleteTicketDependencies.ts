import { Response } from 'express';
import { AttachmentEntityType, Prisma } from '@prisma/client';
import { deleteAttachmentsService } from './deleteAttachmentsService';
import { deleteCommentService } from './deleteCommentService';
import { deleteLabelDependencies } from './deleteLabelDependencies';

export async function deleteTicketDependencies(
  res: Response,
  tx: Prisma.TransactionClient,
  entityType: AttachmentEntityType, // TICKET
  entityId: number, //ticketId
  userId: number
) {
  //Delete related comments
  deleteCommentService(res, tx, entityType, entityId, userId);

  // Delete TicketLabel Associations (Signature uses ticketId for entityId)
  await deleteLabelDependencies(tx, null, entityId);

  // Delete related Attachments
  await deleteAttachmentsService(res, tx, 'TICKET', entityId, userId);
}
