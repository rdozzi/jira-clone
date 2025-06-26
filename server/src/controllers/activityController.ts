import { Request, Response } from 'express';
import { PrismaClient, ActorTypeActivity } from '@prisma/client';

// Get all routes
export async function getAllLogs(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const routes = await prisma.activityLog.findMany();
    return res.status(200).json(routes);
  } catch (error) {
    console.error('Error fetching routes: ', error);
    return res.status(500).json({ error: 'Failed to fetch routes' });
  }
}

// Get logs by ticketId
export async function getLogByTicketId(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { ticketId } = req.params;
    const ticketIdParsed = parseInt(ticketId, 10);

    if (isNaN(ticketIdParsed)) {
      return res.status(400).json({ error: 'Invalid ticket ID' });
    }

    const logs = await prisma.activityLog.findMany({
      where: { targetId: ticketIdParsed, targetType: 'TICKET' },
    });

    return res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs by ticket ID: ', error);
    return res.status(500).json({ error: 'Failed to fetch logs' });
  }
}

// Get logs by userId
export async function getLogByUserId(
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

    return res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs by user ID: ', error);
    return res.status(500).json({ error: 'Failed to fetch logs' });
  }
}
