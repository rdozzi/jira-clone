import { Prisma, PrismaClient, Priority, Type } from '@prisma/client';

export async function createTicket(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  testDescription: string,
  boardId: number,
  userId: number,
  organizationId: number
) {
  const ticket = await prismaTest.ticket.create({
    data: {
      title: `Ticket_${testDescription}`,
      description: `Ticket_${testDescription}`,
      priority: Priority.LOW,
      type: Type.TASK,
      assigneeId: userId,
      reporterId: userId,
      boardId: boardId,
      organizationId: organizationId,
    },
  });

  return ticket;
}
