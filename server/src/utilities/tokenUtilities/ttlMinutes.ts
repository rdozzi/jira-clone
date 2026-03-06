import { TokenPurpose } from '@prisma/client';

const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

export const TTL: Record<TokenPurpose, number> = {
  ACCOUNT_INVITE: 15 * minute,
  RESET_PASSWORD: 1 * day,
  ACCOUNT_ACTIVATION: 1 * day,
} as const;

export type TtlKey = keyof typeof TTL;
