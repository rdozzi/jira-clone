import { Prisma, PrismaClient } from '@prisma/client';

export async function createBoard(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  testDescription: string,
  projectId: number,
  organizationId: number
) {
  const board = await prismaTest.board.create({
    data: {
      name: `Board_${testDescription}`,
      description: `Board_${testDescription}_Description`,
      projectId: projectId,
      organizationId: organizationId,
    },
  });

  return board;
}
