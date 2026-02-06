import { Prisma } from '@prisma/client';

export async function seedTicketsProd(
  prisma: Prisma.TransactionClient,
  organizationId: number,
  userId: number,
  boardId: number,
) {
  const ticketTitle1 = 'Ticket 1';
  const ticketTitle2 = 'Ticket 2';

  const ticket1 = await prisma.ticket.upsert({
    where: {
      title_organizationId: {
        title: ticketTitle1,
        organizationId: organizationId,
      },
    },
    update: {},
    create: {
      title: ticketTitle1,
      description: 'Demo ticket 1 to highlight this feature',
      organizationId: organizationId,
      priority: 'MEDIUM',
      type: 'TASK',
      assigneeId: userId,
      reporterId: userId,
      boardId: boardId,
      dueDate: new Date('02/28/26').toISOString(),
    },
  });

  const ticket2 = await prisma.ticket.upsert({
    where: {
      title_organizationId: {
        title: ticketTitle2,
        organizationId: organizationId,
      },
    },
    update: {},
    create: {
      title: ticketTitle2,
      description: 'Demo ticket 2 to highlight this feature',
      organizationId: organizationId,
      priority: 'MEDIUM',
      type: 'TASK',
      assigneeId: userId,
      reporterId: userId,
      boardId: boardId,
      dueDate: new Date('02/28/26').toISOString(),
    },
  });

  return { ticket1, ticket2 };
}
