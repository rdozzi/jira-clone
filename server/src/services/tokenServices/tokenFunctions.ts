import { Prisma, PrismaClient, TokenPurpose } from '@prisma/client';
import {
  generateRawToken,
  generateHashedToken,
} from '../../utilities/tokenUtilities/generateToken';
import { TTL, TtlKey } from '../../utilities/tokenUtilities/ttlMinutes';

export async function createToken(
  tx: Prisma.TransactionClient,
  {
    userId,
    purpose,
    ttlMinutesType,
  }: {
    userId: number;
    purpose: TokenPurpose;
    ttlMinutesType: TtlKey;
  },
) {
  const ttlMinutes = TTL[ttlMinutesType];

  const rawToken = generateRawToken();
  const tokenHash = generateHashedToken(rawToken);
  const expiresAt = new Date(Date.now() + ttlMinutes);

  await tx.passwordToken.updateMany({
    where: {
      userId,
      purpose,
      hasBeenUsed: false,
    },
    data: { hasBeenUsed: true },
  });

  await tx.passwordToken.create({
    data: {
      userId,
      tokenHash,
      purpose,
      expiresAt,
    },
  });

  return rawToken;
}

export async function validateToken(
  prisma: PrismaClient,
  {
    rawToken,
    purpose,
  }: {
    rawToken: string;
    purpose: TokenPurpose;
  },
) {
  const tokenHash = generateHashedToken(rawToken);

  const record = await prisma.passwordToken.findUnique({
    where: { tokenHash },
  });

  if (!record) return null;
  if (record.purpose !== purpose) return null;
  if (record.hasBeenUsed) return null;
  if (record.expiresAt < new Date()) return null;

  return record;
}
