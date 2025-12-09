import { PrismaClient, AttachmentEntityType } from '@prisma/client';
import { Response } from 'express';
import { deleteProjectDependencies } from '../deletionServices/deleteProjectDependencies';
import { deleteBoardDependencies } from '../deletionServices/deleteBoardDependencies';
import { deleteTicketDependencies } from '../deletionServices/deleteTicketDependencies';
import { deleteCommentDependencies } from '../deletionServices/deleteCommentDependencies';

export async function deleteService(
  prisma: PrismaClient,
  resource: string,
  organizationId: number,
  recordId: number,
  userId: number,
  res: Response
) {
  try {
    const resourceEdited = resource.toUpperCase();

    switch (resourceEdited) {
      case 'PROJECT':
        prisma.$transaction(async (tx) => {
          await deleteProjectDependencies(
            res,
            tx,
            AttachmentEntityType.PROJECT,
            recordId,
            userId,
            organizationId
          );
        });
        return await prisma.project.delete({
          where: { id: recordId, organizationId: organizationId },
        });
      case 'BOARD':
        prisma.$transaction(async (tx) => {
          await deleteBoardDependencies(
            res,
            tx,
            AttachmentEntityType.BOARD,
            recordId,
            userId,
            organizationId
          );
        });
        return await prisma.board.delete({
          where: { id: recordId, organizationId: organizationId },
        });
      case 'TICKET':
        prisma.$transaction(async (tx) => {
          await deleteTicketDependencies(
            res,
            tx,
            AttachmentEntityType.TICKET,
            recordId,
            userId,
            organizationId
          );
        });
        return await prisma.ticket.delete({
          where: { id: recordId, organizationId: organizationId },
        });
      case 'COMMENT':
        prisma.$transaction(async (tx) => {
          await deleteCommentDependencies(
            res,
            tx,
            AttachmentEntityType.COMMENT,
            recordId,
            userId,
            organizationId
          );
        });

        return await prisma.comment.delete({
          where: { id: recordId, organizationId: organizationId },
        });
      default:
        throw new Error('Selected resource is not available for creation.');
    }
  } catch (error) {
    console.error('Error create resource:', error);
    res.status(400).json({ error: 'Could not create resource' });
    return;
  }
}
