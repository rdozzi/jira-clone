import { Request, Response } from 'express';
import { PrismaClient, ActorTypeActivity } from '@prisma/client';

// Get all routes
export async function getAllRoutes(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const routes = await prisma.activityLog.findMany();
    res.status(200).json(routes);
  } catch (error) {
    console.error('Error fetching routes: ', error);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
}

// Get logs by ticketId
export async function getRoutebyTicketId(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { ticketId } = req.params;
    const ticketIdNumber = parseInt(ticketId, 10);

    if (!ticketId) {
      return res.status(400).json({ error: 'Ticket ID is required' });
    }

    const logs = await prisma.activityLog.findMany({
      where: { ticketId: ticketIdNumber },
    });

    if (!logs) {
      return res.status(404).json({ error: 'No logs found' });
    }

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs by ticket ID: ', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
}

// Get logs by userId
export async function getRoutebyUserId(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { userId } = req.params;
    const userIdNumber = parseInt(userId, 10);

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const logs = await prisma.activityLog.findMany({
      where: { userId: userIdNumber, actorType: ActorTypeActivity.USER },
    });

    if (!logs) {
      return res.status(404).json({ error: 'No logs found' });
    }

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs by user ID: ', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
}
