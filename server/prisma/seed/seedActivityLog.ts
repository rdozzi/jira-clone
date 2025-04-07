import { PrismaClient } from '@prisma/client';
import { logSeedUtility } from '../../utility/logSeedUtility';

export async function seedActivityLog(prisma: PrismaClient) {
  //Seed Activity Log

  const seeds = [{ id: 1 }];
  const modelName = 'ActivityLog';
  logSeedUtility({ seeds, modelName, prisma });

  await prisma.activityLog.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: 1,
      actorType: 'USER',
      action: 'Seed database example action 1',
      targetId: 1,
      targetType: 'Ticket',
      metadata: {
        description: 'Seed database example metadata 1',
        additionalInfo: 'Additional info for seed example 1',
        beforeValue: 'None. Seed Value',
        afterValue: 'NA',
      },
      ticketId: 1,
      projectId: 1,
      boardId: 1,
    },
  });
}
