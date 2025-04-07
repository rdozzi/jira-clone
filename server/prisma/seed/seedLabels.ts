import { PrismaClient } from '@prisma/client';
import { logSeedUtility } from '../../utility/logSeedUtility';

export async function seedLabels(prisma: PrismaClient) {
  const seeds = [{ id: 1 }, { id: 2 }];
  const modelName = 'Label';
  logSeedUtility({ seeds, modelName, prisma });

  const label1 = await prisma.label.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Urgent',
      color: '#FF0000',
    },
  });

  const label2 = await prisma.label.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Feature',
      color: '#0000FF',
    },
  });

  return { label1, label2 };
}

export default seedLabels;
