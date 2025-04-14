import { Router, Request, Response } from 'express';
import { AttachmentEntityType } from '@prisma/client';
import { handleUpload } from '../controllers/uploadController';
import { uploadMiddleware } from '../middleware/uploadMiddleware';
import prisma from '../lib/prisma';
import { deleteAttachment } from '../controllers/deleteAttachmentController';
import { validateAttachmentExists } from '../middleware/deleteAttachmentMiddleware';

const router = Router();

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
router.post(
  '/attachments',
  uploadMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    await handleUpload(req, res, prisma);
  }
);

// Delete attachment
router.delete(
  '/attachments/:id',
  validateAttachmentExists,
  async (req: Request, res: Response): Promise<void> => {
    await deleteAttachment(req, res, prisma);
  }
);

// Create several attachments
// Delete attachment
// Delete all attachments
// Download attachment
// Download all attachments by Entity/Id

export default router;
