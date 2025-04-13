import { Router, Request, Response } from 'express';
import { PrismaClient, AttachmentEntityType } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all attachments if Entity/Id is not provided
router.get(
  '/attachments',
  async (req: Request, res: Response): Promise<void> => {
    const { entityType, entityId } = req.body;
    try {
      const whereClause =
        entityType && entityId
          ? {
              entityType: entityType as AttachmentEntityType,
              entityId: Number(entityId),
            }
          : undefined;
      const attachments = await prisma.attachment.findMany({
        where: whereClause,
      });
      res.status(200).json(attachments);
    } catch (error) {
      console.error('Error fetching attachments: ', error);
      res.status(500).json({ error: 'Failed to fetch attachments' });
    }
  }
);

// Create attachment
// Create several attachments
// Delete attachment
// Delete all attachments
// Download attachment
// Download all attachments by Entity/Id

export default router;
