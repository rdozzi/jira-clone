import { PrismaClient } from '@prisma/client';
import { TOTAL_ORG_LIMITS } from './limits';

export async function checkTotalCount(
  prisma: PrismaClient,
  resourceType: keyof typeof TOTAL_ORG_LIMITS,
  organizationId: number
) {
  try {
    let total = 0;
    const totalOrgLimit = TOTAL_ORG_LIMITS[resourceType];

    if (resourceType === 'Project') {
      total = await prisma.project.count({
        where: { organizationId: organizationId },
      });
    } else if (resourceType === 'Board') {
      total = await prisma.board.count({
        where: { organizationId: organizationId },
      });
    } else if (resourceType === 'Ticket') {
      total = await prisma.ticket.count({
        where: { organizationId: organizationId },
      });
    } else if (resourceType === 'Comment') {
      total = await prisma.comment.count({
        where: { organizationId: organizationId },
      });
    } else if (resourceType === 'User') {
      total = await prisma.user.count({
        where: { organizationId: organizationId },
      });
    } else if (resourceType === 'FileStorage') {
      const aggregateResult = await prisma.attachment.aggregate({
        _sum: { fileSize: true },
        where: { organizationId: organizationId },
      });
      total = aggregateResult._sum.fileSize ?? 0;
    } else if (resourceType === 'Label') {
      total = await prisma.label.count({
        where: { organizationId: organizationId },
      });
    } else if (resourceType === 'BannedEmail') {
      total = await prisma.bannedEmail.count({
        where: { organizationId: organizationId },
      });
    }

    const isBelowTotalLimit = total < totalOrgLimit;
    return isBelowTotalLimit;
  } catch (error) {
    throw new Error(`Could not obtain resource count: ${error}`);
  }
}
