import { Prisma, PrismaClient } from '@prisma/client';

export async function createBoard(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  testDescription: string
) {
  const board = await prismaTest.board.findFirst({
    where: { name: `Board_${testDescription}` },
  });
  if (board) {
    console.log(board);
    return board;
  } else {
    const project = await prismaTest.project.findFirst({
      where: { name: `Project_${testDescription}` },
      select: { id: true },
    });

    if (!project) {
      throw Error('Project not defined');
    }

    const board = await prismaTest.board.create({
      data: {
        name: `Board_${testDescription}`,
        description: `Board_${testDescription}_Description`,
        projectId: project?.id,
      },
    });

    console.log(board);

    return board;
  }
}
