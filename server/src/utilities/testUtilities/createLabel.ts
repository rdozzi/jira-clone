import { PrismaClient } from '@prisma/client';

export function createLabel(
  prismaTest: PrismaClient,
  name: string,
  color: string
) {
  name =
    typeof name === 'string'
      ? name
          .trim()
          .replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
          )
      : '';

  color = typeof color === 'string' ? color.toUpperCase() : '';
  const label = prismaTest.label.create({ data: { name: name, color: color } });
  return label;
}
