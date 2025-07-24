import { Response } from 'express';
import { Prisma, AttachmentEntityType } from '@prisma/client';
import { deleteBoardService } from './deleteBoardService';
import { deleteAttachmentsService } from './deleteAttachmentsService';
import { deleteProjectMemberService } from './deleteProjectMemberService';

export async function deleteProjectDependencies(
  res: Response,
  tx: Prisma.TransactionClient,
  entityType: AttachmentEntityType, // PROJECT
  entityId: number, //projectId
  userId: number,
  organizationId: number
) {
  // Delete all related tickets with deleteBoardService. The entityId is the boardId or the entityId value provided from the function arguments.
  await deleteBoardService(res, tx, entityId, userId, organizationId);

  // Delete any attachments with a 'PROJECT' entityType and projectId as the entityId
  await deleteAttachmentsService(
    res,
    tx,
    entityType,
    entityId,
    userId,
    organizationId
  );

  // Delete project member associations related to this project
  await deleteProjectMemberService(res, tx, entityId, organizationId);
}
