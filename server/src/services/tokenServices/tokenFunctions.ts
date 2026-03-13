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
    organizationId,
  }: {
    userId: number;
    purpose: TokenPurpose;
    ttlMinutesType: TtlKey;
    organizationId: number;
  },
) {
  const ttlMinutes = TTL[ttlMinutesType];

  const rawToken = generateRawToken();
  const tokenHash = generateHashedToken(rawToken);
  const expiresAt = new Date(Date.now() + ttlMinutes);

  // Invalidate any previous tokens with the same userId and purpose; mark hasBeenUser to True
  await tx.passwordToken.updateMany({
    where: {
      userId,
      purpose,
      hasBeenUsed: false,
    },
    data: { hasBeenUsed: true },
  });

  // Create a new token
  await tx.passwordToken.create({
    data: {
      userId,
      tokenHash,
      purpose,
      expiresAt,
      organizationId,
    },
  });

  return rawToken;
}

export async function validateToken(prisma: PrismaClient, rawToken: string) {
  const tokenHash = generateHashedToken(rawToken);

  const record = await prisma.passwordToken.findUnique({
    where: { tokenHash },
  });

  if (!record) return null;
  if (
    record.purpose !== TokenPurpose.RESET_PASSWORD &&
    record.purpose !== TokenPurpose.ACCOUNT_ACTIVATION &&
    record.purpose !== TokenPurpose.ACCOUNT_INVITE
  )
    return null;

  if (record.hasBeenUsed) return null;
  if (record.expiresAt < new Date()) return null;

  return record;
}
