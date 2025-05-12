import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { buildLogEvent } from '../services/buildLogEvent';
import { generateDiff } from '../services/generateDiff';

export async function getAllTickets(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const tickets = await prisma.ticket.findMany({
      relationLoadStrategy: 'query',
      include: {
        assignee: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets: ', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
}

export async function getTicketById(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const { id } = req.params;
  try {
    const tickets = await prisma.ticket.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets: ', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
}

export async function getTicketByAssigneeId(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const { userId } = req.params;
  console.log(userId);
  try {
    const tickets = await prisma.ticket.findMany({
      where: { assigneeId: Number(userId) },
    });
    res.status(200).json(tickets);
  } catch (error) {
    console.log('Error fetching tickets: ', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
}

export async function createNewTicket(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const ticketData = req.body;
    const ticket = await prisma.ticket.create({
      data: ticketData,
    });

    res.locals.logEvent = buildLogEvent({
      userId: 1,
      actorType: 'USER',
      action: 'CREATE_TICKET',
      targetId: ticket.id,
      targetType: 'TICKET',
      metadata: {
        title: `${ticket.title}`,
        description: `${ticket.description}`,
      },
      ticketId: ticket.id,
      boardId: ticket.boardId,
      projectId: 1,
    });

    res.status(201).json(ticket);
    next();
  } catch (error) {
    console.error('Error creating ticket: ', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
}

export async function deleteTicket(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const { id } = req.params;

    // Check to see if comments exist/Delete if they exist
    await prisma.comment.deleteMany({ where: { ticketId: Number(id) } });

    // Check to see if Ticket Labels Exist/Delete if they exist
    await prisma.ticketLabel.findMany({ where: { ticketId: Number(id) } });

    const deleteTicket = await prisma.ticket.delete({
      where: { id: Number(id) },
    });

    res.locals.logEvent = buildLogEvent({
      userId: 1,
      actorType: 'USER',
      action: 'DELETE_TICKET',
      targetId: deleteTicket.id,
      targetType: 'TICKET',
      metadata: {
        title: `${deleteTicket.title}`,
        description: `${deleteTicket.description}`,
      },
      ticketId: deleteTicket.id,
      boardId: deleteTicket.boardId,
      projectId: null,
    });

    res.status(200).json(deleteTicket);
    next();
  } catch (error) {
    console.error('Error fetching tickets: ', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
}

export async function updateTicket(
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) {
  try {
    const ticketData = req.body;
    const { ticketId } = req.params;

    const oldTicket = await prisma.ticket.findUnique({
      where: { id: Number(ticketId) },
    });
    if (!oldTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const newTicket = await prisma.ticket.update({
      where: { id: Number(ticketId) },
      data: {
        ...ticketData,
      },
    });

    const changes = generateDiff(oldTicket, newTicket);

    res.locals.logEvent = buildLogEvent({
      userId: 1,
      actorType: 'USER',
      action: 'UPDATE_TICKET',
      targetId: newTicket.id,
      targetType: 'TICKET',
      metadata: {
        ticketDescription: `${newTicket.description}`,
        title: `${newTicket.title}`,
        changes,
      },
      ticketId: newTicket.id,
      boardId: newTicket.boardId,
      projectId: null,
    });

    res.status(200).json(newTicket);
    console.log(
      'status',
      res.status,
      'res.locals.logEvent',
      res.locals.logEvent
    );
    next();
  } catch (error) {
    console.error('Error editing ticket: ', error);
    res.status(500).json({ error: 'Failed to edit ticket' });
  }
}
