import { Prisma, PrismaClient, ActorTypeActivity } from '@prisma/client';

export async function createActivityLog(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  testDescription: string,
  userId: number,
  actorType: ActorTypeActivity,
  targetId: number,
  targetType: string,
  count: number // If I need to make more than 1
) {
  const activityLog = await prismaTest.activityLog.findFirst({
    where: { action: `${targetType}_${testDescription}_${count}` },
  });
  if (activityLog) {
    console.log(activityLog);
    return activityLog;
  } else {
    const activityLog = await prismaTest.activityLog.create({
      data: {
        userId: userId,
        actorType: actorType,
        action: `${targetType}_${testDescription}_${count}`,
        targetId: targetId,
        targetType: targetType,
        metadata: { count },
      },
    });
    console.log(activityLog);

    return activityLog;
  }
}
