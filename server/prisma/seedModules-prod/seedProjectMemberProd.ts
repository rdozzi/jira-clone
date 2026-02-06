import { Prisma } from '@prisma/client';

export async function seedProjectMemberProd(
  tx: Prisma.TransactionClient,
  projectId: number,
  userId: number,
  organizationId: number,
) {
  await tx.projectMember.upsert({
    where: { userId_projectId: { userId: userId, projectId: projectId } },
    update: {},
    create: {
      userId: userId,
      projectId: projectId,
      projectRole: 'ADMIN',
      organizationId: organizationId,
    },
  });

  return;
}
