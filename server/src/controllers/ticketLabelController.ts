import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export function getLabelByTicket(prisma: PrismaClient) {
  return async (req: Request, res: Response) => {
    try {
      // Derived from resolveProjecIdFromTicket
      const ticketId: number = res.locals.ticketId;

      const ticketLabels = await prisma.ticketLabel.findMany({
        where: { ticketId },
        include: { label: true },
      });

      res.status(200).json(ticketLabels);
      return;
    } catch (error) {
      console.error('Error fetching labels for ticket: ', error);
      res.status(500).json({ error: 'Failed to fetch labels' });
      return;
    }
  };
}

export function addLabelToTicket(prisma: PrismaClient) {
  return async (req: Request, res: Response) => {
    try {
      const { ticketId, labelId } = req.params;
      const ticketIdParsed = parseInt(ticketId, 10);
      const labelIdParsed = parseInt(labelId, 10);

      const ticketLabel = await prisma.ticketLabel.create({
        data: { ticketId: ticketIdParsed, labelId: labelIdParsed },
      });
      res.status(201).json(ticketLabel);
      return;
    } catch (error) {
      console.error('Error adding label to ticket: ', error);
      res.status(500).json({ error: 'Failed adding label to ticket' });
    }
  };
}
