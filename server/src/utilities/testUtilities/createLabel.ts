import { PrismaClient } from '@prisma/client';

export function createLabel(
  prismaTest: PrismaClient,
  name: string,
  color: string,
  organizationId: number
) {
  const label = prismaTest.label.create({
    data: { name: name, color: color, organizationId: organizationId },
  });
  return label;
}
