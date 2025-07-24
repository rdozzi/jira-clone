import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

// Get all routes
export async function getAllLogs(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const organizationId = res.locals.userInfo.organizationId;
    const logs = await prisma.activityLog.findMany({
      where: { organizationId: organizationId },
    });
    return res
      .status(200)
      .json({ message: 'Log fetch successful', data: logs });
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
    const ticketId = res.locals.validatedParam;
    const organizationId = res.locals.userInfo.organizationId;

    const logs = await prisma.activityLog.findMany({
      where: {
        targetId: ticketId,
        targetType: 'TICKET',
        organizationId: organizationId,
      },
    });

    return res
      .status(200)
      .json({ message: 'Log fetch successful', data: logs });
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
    const userId = res.locals.validatedParam;
    const organizationId = res.locals.userInfo.organizationId;

    const logs = await prisma.activityLog.findMany({
      where: { userId: userId, organizationId: organizationId },
    });

    res.status(200).json({ message: 'Log fetch successful', data: logs });
    return;
  } catch (error) {
    console.error('Error fetching logs by user ID: ', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
    return;
  }
}
