import { Prisma, PrismaClient, ActorTypeActivity } from '@prisma/client';

export async function createActivityLog(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  testDescription: string,
  userId: number,
  actorType: ActorTypeActivity,
  targetId: number,
  targetType: string,
  count: number, // If I need to make more than 1
  organizationId: number
) {
  const activityLog = await prismaTest.activityLog.findFirst({
    where: { action: `${targetType}_${testDescription}_${count}` },
  });
  if (activityLog) {
    return activityLog;
  } else {
    const activityLog = await prismaTest.activityLog.create({
      data: {
        userId: userId,
        actorType: actorType,
        action: `${targetType}_${testDescription}_${count}_UPDATE`,
        targetId: targetId,
        targetType: targetType,
        metadata: { count },
        organizationId: organizationId,
      },
    });

    return activityLog;
  }
}
