import { Prisma } from '@prisma/client';

export async function seedProjectProd(
  tx: Prisma.TransactionClient,
  organizationId: number,
  userId: number,
) {
  const projectName = 'Demo Project';

  const project = await tx.project.upsert({
    where: {
      name_organizationId: {
        name: projectName,
        organizationId: organizationId,
      },
    },
    update: {},
    create: {
      name: projectName,
      description: 'Demo project to highlight this feature',
      ownerId: userId,
      organizationId: organizationId,
    },
  });

  return project;
}
