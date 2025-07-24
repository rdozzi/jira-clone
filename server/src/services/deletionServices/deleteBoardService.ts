import { Response } from 'express';
import { AttachmentEntityType, Prisma } from '@prisma/client';
import { deleteBoardDependencies } from './deleteBoardDependencies';
import { buildLogEvent } from '../buildLogEvent';

export async function deleteBoardService(
  res: Response,
  tx: Prisma.TransactionClient,
  entityId: number,
  userId: number,
  organizationId: number
) {
  const boards = await tx.board.findMany({
    where: { projectId: entityId },
    select: { id: true, description: true, name: true },
  });
  if (boards.length > 0) {
    const deletedBoards: typeof boards = JSON.parse(JSON.stringify(boards));
    for (const boardObj of boards) {
      await deleteBoardDependencies(
        res,
        tx,
        AttachmentEntityType.BOARD,
        boardObj.id,
        userId,
        organizationId
      );
      await tx.board.delete({ where: { id: boardObj.id } });
    }
    const logEventDeletedComments = deletedBoards.map((boardObj) => {
      return buildLogEvent({
        userId: userId,
        actorType: 'USER',
        action: 'DELETE_BOARD',
        targetId: boardObj.id,
        targetType: 'BOARD',
        organizationId: organizationId,
        metadata: {
          name: boardObj.name,
          description: boardObj.description,
        },
      });
    });

    res.locals.logEvents = (res.locals.logEvents || []).concat(
      logEventDeletedComments
    );
  }
}
