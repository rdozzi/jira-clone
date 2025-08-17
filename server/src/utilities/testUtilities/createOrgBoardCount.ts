import { Prisma, PrismaClient } from '@prisma/client';

export async function createOrgBoardCount(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  organizationId: number
) {
  const orgBoardCountTable = await prismaTest.organizationBoardUsage.create({
    data: {
      organizationId: organizationId,
    },
  });

  return orgBoardCountTable;
}
