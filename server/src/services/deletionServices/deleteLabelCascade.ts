import { Prisma } from '@prisma/client';

// Delete all ids that match labelId from ticketLabel table
// This should be called before deleting the label itself

export async function deleteLabelCascade(
  tx: Prisma.TransactionClient,
  labelId: number
) {
  try {
    await tx.ticketLabel.deleteMany({ where: { labelId: labelId } });
  } catch (error) {
    console.error(
      `Failed to delete TicketLabel associatinos for labelId: ${labelId}`,
      error
    );
    throw error;
  }
}
