import { Prisma, PrismaClient } from '@prisma/client';

export async function createOrgProjectCount(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  organizationId: number
) {
  const orgProjectCountTable = await prismaTest.organizationProjectUsage.create(
    {
      data: {
        organizationId: organizationId,
      },
    }
  );

  return orgProjectCountTable;
}
