import { Response } from 'express';
import { AttachmentEntityType, Prisma } from '@prisma/client';
import { deleteAttachmentsService } from './deleteAttachmentsService';
import { deleteCommentService } from './deleteCommentService';
import { deleteLabelDependencies } from './deleteLabelDependencies';

export async function deleteTicketDependencies(
  res: Response,
  tx: Prisma.TransactionClient,
  ticketEntity: AttachmentEntityType, // TICKET
  ticketId: number, //ticketId
  userId: number
) {
  // Delete related comments
  deleteCommentService(res, tx, ticketId, userId);

  // Delete TicketLabel Associations (Signature uses ticketId for entityId)
  // Labels have no dependencies, no service is needed
  await deleteLabelDependencies(tx, null, ticketId);

  // Delete related Attachments
  // entityType for this service is the entity type sent from the service. In this case it should be "TICKET"
  await deleteAttachmentsService(res, tx, ticketEntity, ticketId, userId);
}
