import { PrismaClient } from '@prisma/client';

export async function seedLabels(prisma: PrismaClient) {
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
  console.log(`Created Labels: ${label1.name}, ${label2.name}`);

  return { label1, label2 };
}

export default seedLabels;
