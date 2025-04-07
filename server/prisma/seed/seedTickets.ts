import { PrismaClient, User, Board } from '@prisma/client';
import { logSeedUtility } from '../../utility/logSeedUtility';

type SeedTicketsArgs = {
  prisma: PrismaClient;
  users: {
    user1: User;
    user2: User;
  };
  boards: {
    board1: Board;
    board2: Board;
  };
};

export async function seedTickets({ prisma, users, boards }: SeedTicketsArgs) {
  const seeds = [{ id: 1 }, { id: 2 }];
  const modelName = 'Ticket';
  logSeedUtility({ seeds, modelName, prisma });
  //Seed Tickets
  const ticket1 = await prisma.ticket.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'ticket1',
      description: 'Ticket 1 used for seeding',
      status: 'BACKLOG',
      priority: 'HIGH',
      type: 'BUG',
      assigneeId: users.user1.id,
      reporterId: users.user2.id,
      boardId: boards.board1.id,
    },
  });
  const ticket2 = await prisma.ticket.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'ticket2',
      description: 'Ticket 2 used for seeding',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      type: 'TASK',
      assigneeId: users.user2.id,
      reporterId: users.user1.id,
      boardId: boards.board2.id,
    },
  });

  return { ticket1, ticket2 };
}
