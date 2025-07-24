import { Prisma, PrismaClient } from '@prisma/client';

export async function createProject(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  testDescription: string,
  userId: number,
  organizationId: number
) {
  const project = await prismaTest.project.create({
    data: {
      name: `Project_${testDescription}`,
      description: `Project_${testDescription}_Description`,
      ownerId: userId,
      organizationId: organizationId,
    },
  });
  return project;
}
