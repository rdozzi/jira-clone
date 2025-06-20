import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

export function getLabelByTicket(prisma: PrismaClient) {
  return async (req: Request, res: Response) => {
    try {
      const { ticketId } = req.params;
      const ticketIdParsed = parseInt(ticketId);

      const ticketLabels = await prisma.ticketLabel.findMany({
        where: { ticketId: ticketIdParsed },
        include: { label: true },
      });

      res.status(200).json({
        message: 'Get TicketLabel Successful (Note: Might be empty)',
        ticketLabelPair: ticketLabels,
      });
      return;
    } catch (error) {
      console.error('Error fetching labels for ticket: ', error);
      res.status(500).json({ error: 'Failed to fetch labels' });
      return;
    }
  };
}

export function addLabelToTicket(prisma: PrismaClient) {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const { ticketId, labelId } = req.params;
      const ticketIdParsed = parseInt(ticketId, 10);
      const labelIdParsed = parseInt(labelId, 10);

      if (isNaN(ticketIdParsed) || isNaN(labelIdParsed)) {
        res.status(400).json({ error: 'Invalid ticketId or labelId' });
        return;
      }

      const ticketLabel = await prisma.ticketLabel.create({
        data: { ticketId: ticketIdParsed, labelId: labelIdParsed },
      });
      res.status(201).json({
        message: 'Label addition to ticket successful',
        ticketLabelPair: ticketLabel,
      });
      return;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        res
          .status(409)
          .json({ error: 'Label is already associated with this ticket' });
        return;
      }
      console.error('Error adding label to ticket: ', error);
      res.status(500).json({ error: 'Failed adding label to ticket' });
      return;
    }
  };
}

export function deleteLabelFromTicket(prisma: PrismaClient) {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const { ticketId, labelId } = req.params;
      const ticketIdParsed = parseInt(ticketId, 10);
      const labelIdParsed = parseInt(labelId, 10);

      if (isNaN(ticketIdParsed) || isNaN(labelIdParsed)) {
        res.status(400).json({ error: 'Invalid ticketId or labelId' });
        return;
      }

      const removedTicketLabel = await prisma.ticketLabel.delete({
        where: {
          ticketId_labelId: {
            ticketId: ticketIdParsed,
            labelId: labelIdParsed,
          },
        },
      });
      res.status(200).json({
        message: 'Label remove successful',
        removedTicketLabel: removedTicketLabel,
      });
      return;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        res.status(404).json({
          error: 'No such label found on this ticket',
        });
        return;
      }
      console.error('Error deleting label from ticket: ', error);
      res.status(500).json({ error: 'Failed deleting label from ticket' });
      return;
    }
  };
}
