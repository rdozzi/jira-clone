import { Response } from 'express';
import { Prisma, AttachmentEntityType } from '@prisma/client';
import { deleteTicketService } from './deleteTicketService';
import { deleteAttachmentsService } from './deleteAttachmentsService';

export async function deleteBoardDependencies(
  res: Response,
  tx: Prisma.TransactionClient,
  entityType: AttachmentEntityType, // BOARD
  entityId: number, //boardId
  userId: number
) {
  // Delete all related tickets with deleteTicketService. The entityType for this function is 'TICKET' and the entityId is the boardId or the entityId value provided from the function arguments.
  await deleteTicketService(res, tx, entityId, userId);

  // Delete any attachments with a 'BOARD' entityType and boardId as the entityId
  await deleteAttachmentsService(res, tx, entityType, entityId, userId);
}
