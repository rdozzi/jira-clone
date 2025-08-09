import { PrismaClient } from '@prisma/client';
import { TOTAL_ORG_LIMITS } from './limits';
import { pruneActivityLog } from './pruneActivityLog';

export async function activityLogCounter(
  prisma: PrismaClient,
  organizationId: number | null
) {
  try {
    if (!organizationId) {
      throw new Error('Organization Id is not defined');
    }

    const LIMIT = TOTAL_ORG_LIMITS['ActivityLog'];

    const exceedsOrgLimitAndLocked = await prisma.$transaction(async (tx) => {
      const { totalActivityLogs: after } = await tx.organizationUsage.update({
        where: { organizationId },
        data: { totalActivityLogs: { increment: 1 } },
        select: { totalActivityLogs: true },
      });
      const before = after - 1;
      const limitExceeded = before < LIMIT && after >= LIMIT;
      if (!limitExceeded) return false;

      const NS = 42;
      const rows = await tx.$queryRaw<
        { locked: boolean }[]
      >`SELECT pg_try_advisory_xact_lock(${NS}, ${organizationId}) AS locked`;

      return rows[0]?.locked === true;
    });

    if (exceedsOrgLimitAndLocked)
      await pruneActivityLog(prisma, organizationId);
  } catch (error) {
    throw new Error(`Error attempting to prune ActivityLog: ${error}`);
  }
}
