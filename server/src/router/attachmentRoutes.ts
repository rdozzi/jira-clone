import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all attachments
router.get(
  '/attachments',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const attachments = await prisma.attachment.findMany();
      res.status(200).json(attachments);
    } catch (error) {
      console.error('Error fetching attachments: ', error);
      res.status(500).json({ error: 'Failed to fetch attachments' });
    }
  }
);
// Get attachment by Entity/Id
// Download attachment
// Download all attachments by Entity/Id
// Create attachment
// Create several attachments
// Delete attachment
// Delete all attachments

export default router;
