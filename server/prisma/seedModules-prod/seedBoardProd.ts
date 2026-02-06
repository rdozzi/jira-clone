import { Prisma } from '@prisma/client';

export async function seedBoardProd(
  tx: Prisma.TransactionClient,
  organizationId: number,
  projectId: number,
) {
  const boardName = 'Demo Board';

  const board = await tx.board.upsert({
    where: {
      name_organizationId: { name: boardName, organizationId: organizationId },
    },
    update: {},
    create: {
      name: boardName,
      description: 'Demo board to highlight this feature',
      organizationId: organizationId,
      projectId: projectId,
    },
  });

  return board;
}
