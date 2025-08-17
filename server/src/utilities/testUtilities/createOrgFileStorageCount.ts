import { Prisma, PrismaClient } from '@prisma/client';

export async function createOrgFileStorageCount(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  organizationId: number
) {
  const orgFileStorageCountTable =
    await prismaTest.organizationFileStorageUsage.create({
      data: {
        organizationId: organizationId,
      },
    });

  return orgFileStorageCountTable;
}
