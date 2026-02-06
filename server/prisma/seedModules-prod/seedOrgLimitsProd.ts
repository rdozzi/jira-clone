import { Prisma } from '@prisma/client';

export async function seedOrgLimitsProd(
  tx: Prisma.TransactionClient,
  organizationId: number,
) {
  await tx.organizationProjectUsage.upsert({
    where: { organizationId: organizationId },
    update: {},
    create: { organizationId: organizationId },
  });

  await tx.organizationBoardUsage.upsert({
    where: { organizationId: organizationId },
    update: {},
    create: { organizationId: organizationId },
  });

  await tx.organizationTicketUsage.upsert({
    where: { organizationId: organizationId },
    update: {},
    create: { organizationId: organizationId },
  });

  await tx.organizationCommentUsage.upsert({
    where: { organizationId: organizationId },
    update: {},
    create: { organizationId: organizationId },
  });

  await tx.organizationUserUsage.upsert({
    where: { organizationId: organizationId },
    update: {},
    create: { organizationId: organizationId },
  });

  await tx.organizationLabelUsage.upsert({
    where: { organizationId: organizationId },
    update: {},
    create: { organizationId: organizationId },
  });

  await tx.organizationActivityLogUsage.upsert({
    where: { organizationId: organizationId },
    update: {},
    create: { organizationId: organizationId },
  });

  await tx.organizationFileStorageUsage.upsert({
    where: { organizationId: organizationId },
    update: {},
    create: { organizationId: organizationId },
  });

  await tx.organizationBannedEmailsUsage.upsert({
    where: { organizationId: organizationId },
    update: {},
    create: { organizationId: organizationId },
  });
}
