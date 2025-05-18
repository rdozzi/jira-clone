import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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
