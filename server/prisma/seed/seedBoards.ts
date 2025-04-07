import { PrismaClient, Project } from '@prisma/client';

type SeedBoardsArgs = {
  prisma: PrismaClient;
  projects: {
    project1: Project;
    project2: Project;
  };
};

export async function seedBoards({ prisma, projects }: SeedBoardsArgs) {
  const board1 = await prisma.board.upsert({
    where: { id: 1 },
    update: { description: 'This is a description for board1' },
    create: {
      name: 'board1',
      projectId: projects.project1.id,
      description: 'This is a description for board1',
    },
  });
  const board2 = await prisma.board.upsert({
    where: { id: 2 },
    update: { description: 'This is a description for board2' },
    create: {
      name: 'board2',
      projectId: projects.project2.id,
      description: 'This is a description for board2',
    },
  });
  console.log(`Created boards: ${board1.name}, ${board2.name}`);

  return { board1, board2 };
}

export default seedBoards;
