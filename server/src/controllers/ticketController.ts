import { Request, Response } from 'express';
import { AttachmentEntityType, PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';
import { deleteTicketDependencies } from '../services/deletionServices/deleteTicketDependencies';
import { createResourceService } from '../services/organizationUsageServices/createResourceService';
import { deleteResourceService } from '../services/organizationUsageServices/deleteResourceService';
import { logBus } from '../lib/logBus';

export async function getAllTickets(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const queryKeys = Object.keys(res.locals.validatedQuery || {});
    const organizationId = res.locals.userInfo.organizationId;

    if (queryKeys.length === 0) {
      // No query provided — fetch all tickets
      const tickets = await prisma.ticket.findMany({
        where: { organizationId: organizationId },
        include: { assignee: { select: { firstName: true, lastName: true } } },
      });
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
      include: { assignee: { select: { firstName: true, lastName: true } } },
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
  const organizationId = res.locals.userInfo.organizationId;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId, organizationId: organizationId },
      include: { assignee: { select: { firstName: true, lastName: true } } },
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

export async function getTicketsByAssigneeId(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const userId = res.locals.validatedParam;
  try {
    const tickets = await prisma.ticket.findMany({
      where: { assigneeId: userId },
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

export async function getTicketsByBoardId(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const boardId = res.locals.validatedParam;
  const organizationId = res.locals.userInfo.organizationId;

  try {
    const tickets = await prisma.ticket.findMany({
      where: { boardId: boardId, organizationId: organizationId },
      include: { assignee: { select: { firstName: true, lastName: true } } },
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
    const organizationId = res.locals.userInfo.organizationId;
    const resourceType = res.locals.resourceType;

    const ticketData = {
      ...res.locals.validatedBody,
      organizationId: organizationId,
    };

    const ticket = await createResourceService(
      prisma,
      resourceType,
      organizationId,
      async (tx) =>
        await tx.ticket.create({
          data: ticketData,
        })
    );

    const logEvents = [
      buildLogEvent({
        userId: userId,
        actorType: 'USER',
        action: 'CREATE_TICKET',
        targetId: ticket.id,
        targetType: 'TICKET',
        organizationId: organizationId,
        metadata: {
          title: `${ticket.title}`,
          description: `${ticket.description}`,
          boardId: ticket.boardId,
        },
      }),
    ];

    logBus.emit('activityLog', logEvents);

    res
      .status(201)
      .json({ message: 'Ticket created successfully', data: ticket });
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
    const organizationId = res.locals.userInfo.organizationId;

    const oldTicket = await prisma.ticket.findUniqueOrThrow({
      where: { id: ticketId, organizationId: organizationId },
      select: { id: true, title: true, description: true, boardId: true },
    });

    await deleteResourceService(prisma, organizationId, async (tx) => {
      await deleteTicketDependencies(
        res,
        tx,
        AttachmentEntityType.TICKET,
        ticketId,
        userId,
        organizationId
      );
      await tx.ticket.delete({
        where: { id: ticketId },
      });
    });

    const logEvents = [
      buildLogEvent({
        userId: userId,
        actorType: 'USER',
        action: 'DELETE_TICKET',
        targetId: oldTicket.id,
        targetType: 'TICKET',
        organizationId: organizationId,
        metadata: {
          title: `${oldTicket.title}`,
          description: `${oldTicket.description}`,
        },
      }),
    ];

    logBus.emit('activityLog', logEvents);

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
    const organizationId = res.locals.userInfo.organizationId;

    const oldTicket = await prisma.ticket.findUnique({
      where: { id: ticketId, organizationId: organizationId },
    });
    if (!oldTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const newTicket = await prisma.ticket.update({
      where: { id: ticketId, organizationId: organizationId },
      data: {
        ...ticketData,
      },
    });

    const changes = generateDiff(oldTicket, newTicket);

    const logEvents = [
      buildLogEvent({
        userId: userId,
        actorType: 'USER',
        action: 'UPDATE_TICKET',
        targetId: newTicket.id,
        targetType: 'TICKET',
        organizationId: organizationId,
        metadata: {
          ticketDescription: `${newTicket.description}`,
          title: `${newTicket.title}`,
          changes,
          boardId: newTicket.boardId,
        },
      }),
    ];

    logBus.emit('activityLog', logEvents);

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
