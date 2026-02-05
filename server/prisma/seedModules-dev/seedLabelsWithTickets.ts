import { PrismaClient, Label, Ticket } from '@prisma/client';

type SeedLabelsWithTicketsArgs = {
  prisma: PrismaClient;
  labels: {
    label1: Label;
    label2: Label;
  };
  tickets: {
    ticket1: Ticket;
    ticket2: Ticket;
  };
};

export async function seedLabelsWithTickets({
  prisma,
  labels,
  tickets,
}: SeedLabelsWithTicketsArgs) {
  const result = await prisma.ticketLabel.createMany({
    data: [
      {
        ticketId: tickets.ticket1.id,
        labelId: labels.label1.id,
        organizationId: 1,
      },
      {
        ticketId: tickets.ticket1.id,
        labelId: labels.label2.id,
        organizationId: 1,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Associated ${result.count} labels(s) with tickets`);
}
