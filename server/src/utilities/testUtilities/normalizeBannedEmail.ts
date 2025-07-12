import { BannedEmail } from '@prisma/client';

export function normalizeBannedEmail(entity: BannedEmail) {
  return {
    ...entity,
    createdAt: entity.createdAt?.toISOString() ?? null,
  };
}

export default normalizeBannedEmail;
