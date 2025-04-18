import { Router, Request, Response } from 'express';
import { AttachmentEntityType } from '@prisma/client';
import {
  handleSingleUpload,
  handleMultipleUpload,
} from '../controllers/uploadController';
import {
  uploadSingleMiddleware,
  uploadMultipleMiddleware,
} from '../middleware/uploadMiddleware';
import prisma from '../lib/prisma';
import { deleteAttachment } from '../controllers/deleteAttachmentController';
import { validateAttachmentExists } from '../middleware/deleteAttachmentMiddleware';
import { deleteManyAttachmentMiddleware } from '../middleware/deleteManyAttachmentMiddleware';
import { deleteManyAttachments } from '../controllers/deleteManyAttachmentsController';

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

// Create single attachment
router.post(
  '/attachments/single',
  uploadSingleMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    await handleSingleUpload(req, res, prisma);
  }
);

// Create several attachments
router.post(
  '/attachments/many',
  uploadMultipleMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    await handleMultipleUpload(req, res, prisma);
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

// Delete many attachments
router.delete(
  '/attachments',
  deleteManyAttachmentMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    await deleteManyAttachments(req, res, prisma);
  }
);

// Download attachment
// Download all attachments by Entity/Id

export default router;
