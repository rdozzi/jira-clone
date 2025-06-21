import { Prisma } from '@prisma/client';

// Delete all ids that match labelId for a label itself or ticketId for tickets and all other deletion cascades

export async function deleteLabelDependencies(
  tx: Prisma.TransactionClient,
  labelId: number | null,
  ticketId: number | null
) {
  if (ticketId) {
    await tx.ticketLabel.deleteMany({ where: { ticketId: ticketId } });
  } else if (labelId) {
    await tx.ticketLabel.deleteMany({ where: { labelId: labelId } });
  }
}
