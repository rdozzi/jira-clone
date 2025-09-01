import { Prisma } from '@prisma/client';

// Delete all ids that match labelId for a label itself or ticketId for tickets and all other deletion cascades

export async function deleteLabelDependencies(
  tx: Prisma.TransactionClient,
  labelId: number | null,
  ticketId: number | null,
  organizationId: number
) {
  // Add ActivityLog record post mvp
  if (ticketId) {
    await tx.ticketLabel.deleteMany({
      where: { ticketId: ticketId, organizationId: organizationId },
    });
  } else if (labelId) {
    await tx.ticketLabel.deleteMany({
      where: { labelId: labelId, organizationId: organizationId },
    });
  }
}
