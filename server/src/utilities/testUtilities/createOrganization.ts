import { Prisma, PrismaClient } from '@prisma/client';

export async function createOrganization(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  testDescription: string,
) {
  const testDescriptionSlug = testDescription.toLowerCase().replace(' ', '-');

  const organization = await prismaTest.organization.create({
    data: {
      name: `Organization_${testDescription}`,
      slug: `organization-${testDescriptionSlug}`,
    },
  });
  return organization;
}
