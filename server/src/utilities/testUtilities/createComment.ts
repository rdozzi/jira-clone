import { Prisma, PrismaClient } from '@prisma/client';

export async function createComment(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  testDescription: string
) {
  // Create a project, "Project1," and search by that parameter.
  const comment = await prismaTest.comment.findFirst({
    where: { content: `Comment_${testDescription}` },
  });
  if (comment) {
    return comment;
  } else {
    const user = await prismaTest.user.findFirst({
      where: { firstName: `User_${testDescription}` },
      select: { id: true },
    });

    const ticket = await prismaTest.ticket.findFirst({
      where: { title: `Ticket_${testDescription}` },
      select: { id: true },
    });

    if (!user || !ticket) {
      throw Error('User and/or ticket are not defined');
    }

    return await prismaTest.comment.create({
      data: {
        ticketId: ticket.id,
        authorId: user.id,
        content: `Comment_${testDescription}`,
      },
    });
  }
}
