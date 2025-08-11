import { PrismaClient } from '@prisma/client';
import { TOTAL_ORG_LIMITS } from './limits';

type TotalOrgLimit = keyof typeof TOTAL_ORG_LIMITS;

export async function getOrgResourceTotal(
  prisma: PrismaClient,
  resourceType: TotalOrgLimit,
  organizationId: number
) {
  let total = 0;

  if (resourceType === 'Project') {
    const query = await prisma.organizationUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalProjects: true },
    });

    total = query!['totalProjects'];
  } else if (resourceType === 'Board') {
    const query = await prisma.organizationUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalBoards: true },
    });

    total = query!['totalBoards'];
  } else if (resourceType === 'Ticket') {
    const query = await prisma.organizationUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalTickets: true },
    });

    total = query!['totalTickets'];
  } else if (resourceType === 'Comment') {
    const query = await prisma.organizationUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalComments: true },
    });

    total = query!['totalComments'];
  } else if (resourceType === 'User') {
    const query = await prisma.organizationUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalUsers: true },
    });

    total = query!['totalUsers'];
  } else if (resourceType === 'FileStorage') {
    const query = await prisma.organizationUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalFileStorage: true },
    });

    total = query!['totalFileStorage'];
  } else if (resourceType === 'Label') {
    const query = await prisma.organizationUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalLabels: true },
    });

    total = query!['totalLabels'];
  } else if (resourceType === 'BannedEmail') {
    const query = await prisma.organizationUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalBannedEmails: true },
    });

    total = query!['totalBannedEmails'];
  }

  return total;
}
