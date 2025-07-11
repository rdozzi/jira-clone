import { PrismaClient } from '@prisma/client';

export async function createBannedEmail(
  prismaTest: PrismaClient,
  testDescription: string,
  count: number,
  reason: string
) {
  const bannedEmail = await prismaTest.bannedEmail.upsert({
    where: {
      email: `${testDescription}_${count}_email@example.com`,
    },
    update: {},
    create: {
      email: `${testDescription}_${count}_email@example.com@example.com`,
      reason: reason,
    },
  });

  return bannedEmail;
}
