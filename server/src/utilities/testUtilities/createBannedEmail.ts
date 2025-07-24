import { PrismaClient } from '@prisma/client';

export async function createBannedEmail(
  prismaTest: PrismaClient,
  testDescription: string,
  count: number,
  reason: string,
  organizationId: number
) {
  const bannedEmail = await prismaTest.bannedEmail.upsert({
    where: {
      email: `${testDescription}_${count}_email@example.com`,
    },
    update: {},
    create: {
      email: `${testDescription}_${count}_email@example.com`,
      reason: reason,
      organizationId: organizationId,
    },
  });

  return bannedEmail;
}
