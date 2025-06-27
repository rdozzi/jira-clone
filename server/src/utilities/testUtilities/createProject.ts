import { Prisma, PrismaClient } from '@prisma/client';

export async function createProject(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  testDescription: string
) {
  const project = await prismaTest.project.findFirst({
    where: { name: `Project_${testDescription}` },
  });
  if (project) {
    return project;
  } else {
    const project = await prismaTest.project.create({
      data: {
        name: `Project_${testDescription}`,
        description: `Project_${testDescription}_Description`,
      },
    });
    return project;
  }
}
