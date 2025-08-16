import { Prisma } from '@prisma/client';

export async function createCountTables(
  tx: Prisma.TransactionClient,
  organizationId: number
) {
  try {
    await tx.organizationProjectUsage.create({
      data: { organizationId: organizationId },
    });
    await tx.organizationBoardUsage.create({
      data: { organizationId: organizationId },
    });
    await tx.organizationTicketUsage.create({
      data: { organizationId: organizationId },
    });
    await tx.organizationCommentUsage.create({
      data: { organizationId: organizationId },
    });
    await tx.organizationUserUsage.create({
      data: { organizationId: organizationId },
    });
    await tx.organizationLabelUsage.create({
      data: { organizationId: organizationId },
    });
    await tx.organizationActivityLogUsage.create({
      data: { organizationId: organizationId },
    });
    await tx.organizationFileStorageUsage.create({
      data: { organizationId: organizationId },
    });
    await tx.organizationBannedEmailsUsage.create({
      data: { organizationId: organizationId },
    });
  } catch (error) {
    throw new Error(`Could not create usage tables: ${error}`);
  }
}
