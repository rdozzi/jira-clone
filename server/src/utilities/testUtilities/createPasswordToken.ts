import { Prisma, PrismaClient, TokenPurpose } from '@prisma/client';
import { generateHashedToken } from '../tokenUtilities/generateToken';

export async function createPasswordToken(
  prismaTest: PrismaClient | Prisma.TransactionClient,
  userId: number,
  rawToken: string,
  organizationId: number,
  purpose: TokenPurpose,
) {
  const tokenHash = generateHashedToken(rawToken);
  const userTokenRecord = await prismaTest.passwordToken.findUnique({
    where: { tokenHash: tokenHash },
  });

  if (userTokenRecord) {
    return userTokenRecord;
  } else {
    const user = await prismaTest.passwordToken.create({
      data: {
        userId: userId,
        tokenHash: tokenHash,
        purpose: purpose,
        expiresAt: new Date(Date.now() + 1000 * 60 * 30),
        organizationId: organizationId,
      },
    });
    return user;
  }
}
