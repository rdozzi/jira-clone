import { Prisma } from '@prisma/client';

export const organizationName = 'Demo Organization';

export async function seedOrganizationProd(tx: Prisma.TransactionClient) {
  const organization = await tx.organization.upsert({
    where: { name: organizationName },
    update: {},
    create: {
      name: organizationName,
    },
  });

  return organization;
}
