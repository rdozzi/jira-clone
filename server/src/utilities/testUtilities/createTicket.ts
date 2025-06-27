import { Prisma, PrismaClient, Priority, Type } from '@prisma/client';

export async function createTicket(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  testDescription: string
) {
  const ticket = await prismaTest.ticket.findFirst({
    where: { title: `Ticket_${testDescription}` },
  });
  if (ticket) {
    return ticket;
  } else {
    const user = await prismaTest.user.findFirst({
      where: { firstName: `User_${testDescription}` },
      select: { id: true },
    });

    const board = await prismaTest.board.findFirst({
      where: { name: `Board_${testDescription}` },
      select: { id: true },
    });

    if (!user || !board) {
      throw Error('User and/or Board are not defined');
    }

    const ticket = await prismaTest.ticket.create({
      data: {
        title: `Ticket_${testDescription}`,
        description: `Ticket_${testDescription}`,
        priority: Priority.LOW,
        type: Type.TASK,
        assigneeId: user.id,
        reporterId: user.id,
        boardId: board.id,
      },
    });

    return ticket;
  }
}
