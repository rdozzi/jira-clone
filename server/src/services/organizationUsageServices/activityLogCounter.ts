import { PrismaClient } from '@prisma/client';
import { pruneActivityLog } from './pruneActivityLog';
import { namespace } from '../../lib/namespace';

export async function activityLogCounter(
  prisma: PrismaClient,
  organizationId: number | null
): Promise<boolean> {
  try {
    if (!organizationId) {
      throw new Error('Organization Id is not defined');
    }

    const logLimitInfo = await prisma.organizationActivityLogUsage.findUnique({
      where: { organizationId: organizationId },
      select: { totalActivityLogs: true, maxActivityLogs: true },
    });

    if (!logLimitInfo) {
      throw new Error(
        'No log limit record found for organization. Check database.'
      );
    }

    const limit = logLimitInfo.maxActivityLogs;

    if (!limit) return false;

    const exceedsOrgLimitAndLocked = await prisma.$transaction(async (tx) => {
      const { totalActivityLogs: after } =
        await tx.organizationActivityLogUsage.update({
          where: { organizationId },
          data: { totalActivityLogs: { increment: 1 } },
          select: { totalActivityLogs: true },
        });

      const before = after - 1;

      const limitExceeded = before < limit && after >= limit;

      if (!limitExceeded) {
        return false;
      }

      const NS: number = namespace['createLog'];
      const [{ locked }] = await tx.$queryRaw<
        { locked: boolean }[]
      >`SELECT pg_try_advisory_xact_lock(${NS}::int, ${organizationId}::int) AS locked`;

      return locked === true;
    });

    if (exceedsOrgLimitAndLocked) {
      await pruneActivityLog(prisma, organizationId);
    }

    return exceedsOrgLimitAndLocked;
  } catch (error) {
    throw new Error(`Error attempting to prune ActivityLog: ${error}`);
  }
}
