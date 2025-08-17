import { PrismaClient } from '@prisma/client';

export async function pruneActivityLog(
  prisma: PrismaClient,
  organizationId: number
) {
  const BATCH = 1000;

  return await prisma.$transaction(async (tx) => {
    const oldest = await tx.activityLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'asc' },
      take: BATCH,
      select: { id: true },
    });

    if (oldest.length === 0) return { deleted: 0 };

    await tx.activityLog.deleteMany({
      where: { id: { in: oldest.map((o) => o.id) } },
    });

    await tx.organizationActivityLogUsage.update({
      where: { organizationId },
      data: { totalActivityLogs: { decrement: oldest.length } },
    });

    return oldest.length;
  });
}
