import { Prisma, PrismaClient } from '@prisma/client';

export async function createOrgBannedEmailCount(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  organizationId: number
) {
  const orgBannedEmailCountTable =
    await prismaTest.organizationBannedEmailsUsage.create({
      data: {
        organizationId: organizationId,
      },
    });

  return orgBannedEmailCountTable;
}
