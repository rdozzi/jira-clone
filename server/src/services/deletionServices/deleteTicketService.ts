import { Response } from 'express';
import { AttachmentEntityType, Prisma } from '@prisma/client';
import { deleteTicketDependencies } from './deleteTicketDependencies';
import { buildLogEvent } from '../buildLogEvent';

export async function deleteTicketService(
  res: Response,
  tx: Prisma.TransactionClient,
  entityId: number, //boardId
  userId: number
) {
  const tickets = await tx.ticket.findMany({
    where: { boardId: entityId },
    select: { id: true, title: true, description: true },
  });
  if (tickets.length > 0) {
    const deletedTickets: typeof tickets = JSON.parse(JSON.stringify(tickets));
    for (const ticketObj of tickets) {
      await deleteTicketDependencies(
        res,
        tx,
        AttachmentEntityType.TICKET,
        ticketObj.id,
        userId
      );
      await tx.ticket.delete({ where: { id: ticketObj.id } });
    }
    const logEventDeletedComments = deletedTickets.map((ticketObj) => {
      return buildLogEvent({
        userId: userId,
        actorType: 'USER',
        action: 'DELETE_TICKET',
        targetId: ticketObj.id,
        targetType: 'TICKET',
        metadata: {
          title: `${ticketObj.title}`,
          description: `${ticketObj.description}`,
        },
      });
    });

    res.locals.logEvents = (res.locals.logEvents || []).concat(
      logEventDeletedComments
    );
  }
}
