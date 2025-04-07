import { PrismaClient, Ticket, User } from '@prisma/client';

type SeedCommentsArgs = {
  prisma: PrismaClient;
  tickets: {
    ticket1: Ticket;
    ticket2: Ticket;
  };
  users: {
    user1: User;
    user2: User;
  };
};

export async function seedComments({
  prisma,
  tickets,
  users,
}: SeedCommentsArgs) {
  const comment1 = await prisma.comment.upsert({
    where: { id: 1 },
    update: {},
    create: {
      content: 'This is a comment on ticket 1',
      ticketId: tickets.ticket1.id,
      authorId: users.user1.id,
    },
  });
  const comment2 = await prisma.comment.upsert({
    where: { id: 2 },
    update: {},
    create: {
      content: 'This is a comment on ticket 2',
      ticketId: tickets.ticket2.id,
      authorId: users.user2.id,
    },
  });
  console.log(`Created comments: ${comment1.content}, ${comment2.content}`);
  return { comment1, comment2 };
}
