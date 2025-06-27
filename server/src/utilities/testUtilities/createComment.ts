import { Prisma, PrismaClient } from '@prisma/client';

export async function createComment(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  testDescription: string,
  ticketId: number,
  userId: number
) {
  const comment = await prismaTest.comment.create({
    data: {
      ticketId: ticketId,
      authorId: userId,
      content: `Comment_${testDescription}`,
    },
  });

  return comment;
}
