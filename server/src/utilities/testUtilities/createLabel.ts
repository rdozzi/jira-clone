import { PrismaClient } from '@prisma/client';

export function createLabel(
  prismaTest: PrismaClient,
  name: string,
  color: string
) {
  const label = prismaTest.label.create({ data: { name: name, color: color } });
  return label;
}
