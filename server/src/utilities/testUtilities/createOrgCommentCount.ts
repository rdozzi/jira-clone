import { Prisma, PrismaClient } from '@prisma/client';

export async function createOrgCommentCount(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  organizationId: number
) {
  const orgCommentCountTable = await prismaTest.organizationCommentUsage.create(
    {
      data: {
        organizationId: organizationId,
      },
    }
  );

  return orgCommentCountTable;
}
