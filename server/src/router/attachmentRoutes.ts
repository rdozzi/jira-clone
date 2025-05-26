import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { CustomRequest } from '../types/CustomRequest';
import { GlobalRole, ProjectRole } from '@prisma/client';
import { authorizeGlobalRole } from '../middleware/authorizeGlobalRole';
import prisma from '../lib/prisma';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import {
  checkAttachmentOwnership,
  checkMultipleAttachmentOwnerShip,
} from '../middleware/checkAttachmentOwnershipMiddleware';

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
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllAttachments(req, res, prisma);
  }
);

// Create single attachment
router.post(
  '/attachments/single',
  authorizeGlobalRole(GlobalRole.USER),
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.USER),
  uploadSingleMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await handleSingleUpload(req as CustomRequest, res, next, prisma);
  }
);

// Create several attachments
router.post(
  '/attachments/many',
  authorizeGlobalRole(GlobalRole.USER),
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.USER),
  uploadMultipleMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await handleMultipleUpload(req as CustomRequest, res, next, prisma);
  }
);

// Delete attachment
router.delete(
  '/attachments/:id',
  authorizeGlobalRole(GlobalRole.USER),
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.USER),
  checkAttachmentOwnership(prisma) as RequestHandler,
  validateAttachmentExists as unknown as RequestHandler,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteAttachment(req as CustomRequest, res, next, prisma);
  }
);

// Delete many attachments
router.delete(
  '/attachments',
  authorizeGlobalRole(GlobalRole.USER),
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.USER),
  checkMultipleAttachmentOwnerShip(prisma) as RequestHandler,
  deleteManyAttachmentMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteManyAttachments(req, res, next, prisma);
  }
);

// Download attachment
router.get(
  '/attachments/:id/download',
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.USER),
  downloadSingleAttachmentMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await downloadSingleAttachment(req, res, next, prisma);
  }
);

// Download multiple attachments by Entity/Id
router.post(
  '/attachments/download',
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.USER),
  downloadMultipleAttachmentMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await downloadMultipleAttachments(req, res, next, prisma);
  }
);

export default router;
