import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';
import { deleteTicketDependencies } from '../services/deletionServices/deleteTicketDependencies';

export async function getAllTickets(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const queryKeys = Object.keys(res.locals.validateQuery || {});

    if (queryKeys.length === 0) {
      // No query provided — fetch all tickets
      const tickets = await prisma.ticket.findMany();
      return res
        .status(200)
        .json({ message: 'Tickets fetched successfully', data: tickets });
    }

    const query = queryKeys[0];
    const data = res.locals.validatedQuery[query];

    const assigneeId = query === 'assigneeId' ? data : undefined;
    const reporterId = query === 'reporterId' ? data : undefined;

    const tickets = await prisma.ticket.findMany({
      where: {
        ...(assigneeId !== undefined ? { assigneeId } : {}),
        ...(reporterId !== undefined ? { reporterId } : {}),
      },
    });
    res
      .status(200)
      .json({ message: 'Tickets fetched successfully', data: tickets });
    return;
  } catch (error) {
    console.error('Error fetching tickets: ', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
    return;
  }
}

export async function getTicketById(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const ticketId = res.locals.validatedParam;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }
    res
      .status(200)
      .json({ message: 'Ticket fetched successfully', data: ticket });
    return;
  } catch (error) {
    console.error('Error fetching tickets: ', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
    return;
  }
}

// This function is deprecated. Searching strictly by parameters that doesn't necessitate project association will be used with query terms in the getAllTickets.
// export async function getTicketByAssigneeId(
//   req: Request,
//   res: Response,
//   prisma: PrismaClient
// ) {
//   const { userId } = req.params;
//   const userIdParsed = parseInt(userId, 10);
//   try {
//     const tickets = await prisma.ticket.findMany({
//       where: { assigneeId: userIdParsed },
//     });
//     res
//       .status(200)
//       .json({ message: 'Ticket fetched successfully', data: tickets });
//     return;
//   } catch (error) {
//     console.log('Error fetching tickets: ', error);
//     res.status(500).json({ error: 'Failed to fetch tickets' });
//     return;
//   }
// }

export async function getTicketsByBoardId(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const boardId = res.locals.validatedParam;

  try {
    const tickets = await prisma.ticket.findMany({
      where: { boardId: boardId },
    });
    res
      .status(200)
      .json({ message: 'Tickets fetched successfully', data: tickets });
    return;
  } catch (error) {
    console.log('Error fetching tickets: ', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
    return;
  }
}

export async function createNewTicket(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const userId = res.locals.userInfo.id;

    const ticketData = res.locals.validatedBody;
    const ticket = await prisma.ticket.create({
      data: ticketData,
    });

    res.locals.logEvent = buildLogEvent({
      userId: userId,
      actorType: 'USER',
      action: 'CREATE_TICKET',
      targetId: ticket.id,
      targetType: 'TICKET',
      metadata: {
        title: `${ticket.title}`,
        description: `${ticket.description}`,
        boardId: ticket.boardId,
      },
    });

    res
      .status(201)
      .json({ message: 'Created ticket successfully', data: ticket });
    return;
  } catch (error) {
    console.error('Error creating ticket: ', error);
    res.status(500).json({ error: 'Failed to create ticket' });
    return;
  }
}

export async function deleteTicket(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const userId = res.locals.userInfo.id;

    const ticketId = res.locals.validatedParam;

    const oldTicket = await prisma.ticket.findUniqueOrThrow({
      where: { id: ticketId },
      select: { id: true, title: true, description: true, boardId: true },
    });

    prisma.$transaction(async (tx) => {
      await deleteTicketDependencies(res, tx, 'TICKET', ticketId, userId);
      await tx.ticket.delete({
        where: { id: ticketId },
      });
    });

    res.locals.logEvent = buildLogEvent({
      userId: userId,
      actorType: 'USER',
      action: 'DELETE_TICKET',
      targetId: oldTicket.id,
      targetType: 'TICKET',
      metadata: {
        title: `${oldTicket.title}`,
        description: `${oldTicket.description}`,
      },
    });

    res
      .status(200)
      .json({ message: 'Ticket deleted successfully', data: oldTicket });
    return;
  } catch (error) {
    console.error('Error fetching tickets: ', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
    return;
  }
}

export async function updateTicket(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const userId = res.locals.userInfo.id;

    const ticketData = res.locals.validatedBody;
    const ticketId = res.locals.validatedParam;

    const oldTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!oldTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const newTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        ...ticketData,
      },
    });

    const changes = generateDiff(oldTicket, newTicket);

    res.locals.logEvent = buildLogEvent({
      userId: userId,
      actorType: 'USER',
      action: 'UPDATE_TICKET',
      targetId: newTicket.id,
      targetType: 'TICKET',
      metadata: {
        ticketDescription: `${newTicket.description}`,
        title: `${newTicket.title}`,
        changes,
        boardId: newTicket.boardId,
      },
    });

    res
      .status(200)
      .json({ message: 'Ticket updated successfully', data: newTicket });
    return;
  } catch (error) {
    console.error('Error editing ticket: ', error);
    res.status(500).json({ error: 'Failed to edit ticket' });
    return;
  }
}
