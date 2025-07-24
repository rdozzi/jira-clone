import { PrismaClient } from '@prisma/client';

export function createTicketLabel(
  prismaTest: PrismaClient,
  ticketId: number,
  labelId: number,
  organizationId: number
) {
  return prismaTest.ticketLabel.create({
    data: {
      ticketId: ticketId,
      labelId: labelId,
      organizationId: organizationId,
    },
  });
}
