import { Prisma, PrismaClient } from '@prisma/client';

export async function createOrgLabelCount(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  organizationId: number
) {
  const orgLabelCountTable = await prismaTest.organizationLabelUsage.create({
    data: {
      organizationId: organizationId,
    },
  });

  return orgLabelCountTable;
}
