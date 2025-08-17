import { Prisma, PrismaClient } from '@prisma/client';

export async function createOrgActivityLogCount(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  organizationId: number
) {
  const orgActivityLogCountTable =
    await prismaTest.organizationActivityLogUsage.create({
      data: {
        organizationId: organizationId,
      },
    });

  return orgActivityLogCountTable;
}
