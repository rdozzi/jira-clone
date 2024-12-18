import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/tickets', async (req: Request, res: Response): Promise<void> => {
  try {
    const tickets = await prisma.ticket.findMany();
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get(
  '/tickets/:id',
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const tickets = await prisma.ticket.findUnique({
        where: { id: Number(id) },
      });
      res.status(200).json(tickets);
    } catch (error) {
      console.error('Error fetching tickets: ', error);
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  }
);

export default router;
