import { Response } from 'express';
import { AttachmentEntityType, Prisma } from '@prisma/client';
import { deleteCommentDependencies } from './deleteCommentDependencies';
import { buildLogEvent } from '../buildLogEvent';
import { logBus } from '../../lib/logBus';

export async function deleteCommentService(
  res: Response,
  tx: Prisma.TransactionClient,
  entityId: number,
  userId: number,
  organizationId: number
) {
  const comments = await tx.comment.findMany({
    where: { ticketId: entityId, organizationId: organizationId },
    select: { id: true, authorId: true, content: true },
  });
  if (comments.length > 0) {
    const deletedComments: typeof comments = JSON.parse(
      JSON.stringify(comments)
    );
    for (const commentObj of comments) {
      await deleteCommentDependencies(
        res,
        tx,
        AttachmentEntityType.COMMENT,
        commentObj.id,
        userId,
        organizationId
      );
      await tx.comment.delete({ where: { id: commentObj.id } });
    }
    const logEventDeletedComments = deletedComments.map((commentObj) => {
      return buildLogEvent({
        userId: userId,
        actorType: 'USER',
        action: 'DELETE_COMMENT',
        targetId: commentObj.id,
        targetType: 'COMMENT',
        organizationId: organizationId,
        metadata: {
          authorId: commentObj.authorId,
          content: commentObj.content,
          timestamp: new Date(),
        },
      });
    });

    logBus.emit('activityLog', logEventDeletedComments);
  }
}
