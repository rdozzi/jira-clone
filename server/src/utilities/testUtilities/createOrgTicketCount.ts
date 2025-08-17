import { Prisma, PrismaClient } from '@prisma/client';

export async function createOrgTicketCount(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  organizationId: number
) {
  const orgTicketCountTable = await prismaTest.organizationTicketUsage.create({
    data: {
      organizationId: organizationId,
    },
  });

  return orgTicketCountTable;
}
