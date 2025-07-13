import { BannedEmail, Label } from '@prisma/client';

type EntityType = BannedEmail | Label;

export function normalizeEntity(entity: EntityType) {
  return {
    ...entity,
    createdAt: entity.createdAt?.toISOString() ?? null,
  };
}
