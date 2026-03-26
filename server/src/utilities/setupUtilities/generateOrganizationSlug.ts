import slugify from 'slugify';
import { Prisma, PrismaClient } from '@prisma/client';

export async function generateOrganizationSlug(
  prisma: PrismaClient | Prisma.TransactionClient,
  orgName: string,
): Promise<string> {
  const baseSlug = slugify(orgName, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
