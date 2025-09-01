import { Response } from 'express';
import { AttachmentEntityType, Prisma } from '@prisma/client';
import { deleteTicketDependencies } from './deleteTicketDependencies';
import { buildLogEvent } from '../buildLogEvent';
import { logBus } from '../../lib/logBus';

export async function deleteTicketService(
  res: Response,
  tx: Prisma.TransactionClient,
  entityId: number, //boardId
  userId: number,
  organizationId: number
) {
  const tickets = await tx.ticket.findMany({
    where: { boardId: entityId, organizationId: organizationId },
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
        userId,
        organizationId
      );
      await tx.ticket.delete({ where: { id: ticketObj.id } });
    }
    const logEventDeletedTickets = deletedTickets.map((ticketObj) => {
      return buildLogEvent({
        userId: userId,
        actorType: 'USER',
        action: 'DELETE_TICKET',
        targetId: ticketObj.id,
        targetType: 'TICKET',
        organizationId: organizationId,
        metadata: {
          title: `${ticketObj.title}`,
          description: `${ticketObj.description}`,
        },
      });
    });

    logBus.emit('activityLog', logEventDeletedTickets);
  }
}
