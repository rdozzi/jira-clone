import { Router, Request, Response } from 'express';
import { AttachmentEntityType } from '@prisma/client';

import prisma from '../lib/prisma';

import {
  uploadSingleMiddleware,
  uploadMultipleMiddleware,
} from '../middleware/uploadMiddleware';
import { deleteManyAttachmentMiddleware } from '../middleware/deleteManyAttachmentMiddleware';
import { validateAttachmentExists } from '../middleware/deleteAttachmentMiddleware';
import { downloadSingleAttachmentMiddleware } from '../middleware/downloadSingleMiddleware';
import { downloadMultipleAttachmentMiddleware } from '../middleware/downloadMultipleMiddleware';

import {
  handleSingleUpload,
  handleMultipleUpload,
} from '../controllers/uploadController';
import { deleteManyAttachments } from '../controllers/deleteManyAttachmentsController';
import { deleteAttachment } from '../controllers/deleteAttachmentController';
import { downloadSingleAttachment } from '../controllers/downloadController';
import { downloadMultipleAttachments } from '../controllers/downloadMultipleController';

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
router.get(
  '/attachments/:id/download',
  downloadSingleAttachmentMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    await downloadSingleAttachment(req, res, prisma);
  }
);

// Download multiple attachments by Entity/Id
router.post(
  '/attachments/download',
  downloadMultipleAttachmentMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    await downloadMultipleAttachments(req, res, prisma);
  }
);

export default router;
