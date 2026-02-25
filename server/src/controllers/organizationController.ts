import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export async function getOrganization(
  req: Request,
  res: Response,
  prisma: PrismaClient,
) {
  try {
    const organizationId = res.locals.userInfo.organizationId;

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    res.status(200).json({
      message: 'Organization fetched successfully',
      data: organization,
    });
  } catch (error) {
    console.error('Error fetching projects: ', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
    return;
  }
}
