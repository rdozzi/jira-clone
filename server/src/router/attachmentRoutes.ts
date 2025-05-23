import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { CustomRequest } from '../types/CustomRequest';
import prisma from '../lib/prisma';

import {
  uploadSingleMiddleware,
  uploadMultipleMiddleware,
} from '../middleware/uploadMiddleware';
import { deleteManyAttachmentMiddleware } from '../middleware/deleteManyAttachmentMiddleware';
import { validateAttachmentExists } from '../middleware/deleteAttachmentMiddleware';
import { downloadSingleAttachmentMiddleware } from '../middleware/downloadSingleMiddleware';
import { downloadMultipleAttachmentMiddleware } from '../middleware/downloadMultipleMiddleware';

import { getAllAttachments } from '../controllers/attachmentControllers/getAllAttachments';
import {
  handleSingleUpload,
  handleMultipleUpload,
} from '../controllers/attachmentControllers/uploadController';
import { deleteManyAttachments } from '../controllers/attachmentControllers/deleteManyAttachmentsController';
import { deleteAttachment } from '../controllers/attachmentControllers/deleteAttachmentController';
import { downloadSingleAttachment } from '../controllers/attachmentControllers/downloadController';
import { downloadMultipleAttachments } from '../controllers/attachmentControllers/downloadMultipleController';

const router = Router();

// Get all attachments if Entity/Id is not provided
router.get(
  '/attachments',
  async (req: Request, res: Response): Promise<void> => {
    await getAllAttachments(req, res, prisma);
  }
);

// Create single attachment
router.post(
  '/attachments/single',
  uploadSingleMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await handleSingleUpload(req as CustomRequest, res, next, prisma);
  }
);

// Create several attachments
router.post(
  '/attachments/many',
  uploadMultipleMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await handleMultipleUpload(req as CustomRequest, res, next, prisma);
  }
);

// Delete attachment
router.delete(
  '/attachments/:id',
  validateAttachmentExists as unknown as RequestHandler,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteAttachment(req as CustomRequest, res, next, prisma);
  }
);

// Delete many attachments
router.delete(
  '/attachments',
  deleteManyAttachmentMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteManyAttachments(req, res, next, prisma);
  }
);

// Download attachment
router.get(
  '/attachments/:id/download',
  downloadSingleAttachmentMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await downloadSingleAttachment(req, res, next, prisma);
  }
);

// Download multiple attachments by Entity/Id
router.post(
  '/attachments/download',
  downloadMultipleAttachmentMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await downloadMultipleAttachments(req, res, next, prisma);
  }
);

export default router;
