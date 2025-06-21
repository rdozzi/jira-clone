import { Response } from 'express';
import { AttachmentEntityType, Prisma } from '@prisma/client';
import { deleteCommentDependencies } from './deleteCommentDependencies';
import { buildLogEvent } from '../buildLogEvent';

export async function deleteCommentService(
  res: Response,
  tx: Prisma.TransactionClient,
  entityId: number,
  userId: number
) {
  const comments = await tx.comment.findMany({
    where: { ticketId: entityId },
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
        AttachmentEntityType.TICKET,
        commentObj.id,
        userId
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
        metadata: {
          authorId: commentObj.authorId,
          content: commentObj.content,
          timestamp: new Date(),
        },
      });
    });

    res.locals.logEvents = (res.locals.logEvents || []).concat(
      logEventDeletedComments
    );
  }
}
