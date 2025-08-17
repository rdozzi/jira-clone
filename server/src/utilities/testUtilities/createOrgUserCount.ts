import { Prisma, PrismaClient } from '@prisma/client';

export async function createOrgUserCount(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  organizationId: number
) {
  const orgUserCountTable = await prismaTest.organizationUserUsage.create({
    data: {
      organizationId: organizationId,
    },
  });

  return orgUserCountTable;
}
