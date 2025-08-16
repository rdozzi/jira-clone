import { PrismaClient } from '@prisma/client';
import { TotalOrgLimit } from './checkTotalMaxCount';

interface TotalAndMax {
  total: number | null;
  max: number | null;
}

export async function getTotalAndMaxForResource(
  prisma: PrismaClient,
  resourceType: TotalOrgLimit,
  organizationId: number
) {
  let { total, max }: TotalAndMax = { total: 0, max: 0 };

  if (resourceType === 'Project') {
    const query = await prisma.organizationProjectUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalProjects: true, maxProjects: true },
    });

    total = query?.totalProjects ?? 0;
    max = query?.maxProjects ?? null;
  } else if (resourceType === 'Board') {
    const query = await prisma.organizationBoardUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalBoards: true, maxBoards: true },
    });
    total = query?.totalBoards ?? 0;
    max = query?.maxBoards ?? null;
  } else if (resourceType === 'Ticket') {
    const query = await prisma.organizationTicketUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalTickets: true, maxTickets: true },
    });
    total = query?.totalTickets ?? 0;
    max = query?.maxTickets ?? null;
  } else if (resourceType === 'Comment') {
    const query = await prisma.organizationCommentUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalComments: true, maxComments: true },
    });
    total = query?.totalComments ?? 0;
    max = query?.maxComments ?? null;
  } else if (resourceType === 'User') {
    const query = await prisma.organizationUserUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalUsers: true, maxUsers: true },
    });
    total = query?.totalUsers ?? 0;
    max = query?.maxUsers ?? null;
  } else if (resourceType === 'FileStorage') {
    const query = await prisma.organizationFileStorageUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalFileStorage: true, maxFileStorage: true },
    });
    total = query?.totalFileStorage ?? 0;
    max = query?.maxFileStorage ?? null;
  } else if (resourceType === 'Label') {
    const query = await prisma.organizationLabelUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalLabels: true, maxLabels: true },
    });
    total = query?.totalLabels ?? 0;
    max = query?.maxLabels ?? null;
  } else if (resourceType === 'BannedEmail') {
    const query = await prisma.organizationBannedEmailsUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalBannedEmails: true, maxBannedEmails: true },
    });
    total = query?.totalBannedEmails ?? 0;
    max = query?.maxBannedEmails ?? null;
  }

  return { total, max };
}
