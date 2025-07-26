import { Prisma, PrismaClient } from '@prisma/client';

export async function createOrganization(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  testDescription: string
) {
  const organization = await prismaTest.organization.create({
    data: {
      name: `Organization_${testDescription}`,
    },
  });
  return organization;
}
