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
  checkMultipleAttachmentOwnership,
} from '../middleware/attachments/checkAttachmentOwnershipMiddleware';
import { checkEntityType } from '../middleware/attachments/checkEntityType';
import { checkIfGlobalSuperAdmin } from '../middleware/checkIfGlobalSuperAdmin';

import {
  uploadSingleMiddleware,
  uploadMultipleMiddleware,
} from '../middleware/attachments/uploadMiddleware';
import { deleteManyAttachmentMiddleware } from '../middleware/attachments/deleteManyAttachmentMiddleware';
import { validateAttachmentExists } from '../middleware/attachments/deleteAttachmentMiddleware';
import { downloadSingleAttachmentMiddleware } from '../middleware/attachments/downloadSingleMiddleware';
import { downloadMultipleAttachmentMiddleware } from '../middleware/attachments/downloadMultipleMiddleware';

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

// Get all attachments
router.get(
  '/attachments',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllAttachments(req, res, prisma);
  }
);

// Get all attachments by Entity/Id
router.get(
  '/attachments/:entityType/:entityId',
  authorizeGlobalRole(GlobalRole.USER),
  checkEntityType,
  checkIfGlobalSuperAdmin,
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.VIEWER, { allowGlobalSuperAdmin: true }),
  async (req: Request, res: Response): Promise<void> => {
    await getAllAttachments(req, res, prisma);
  }
);

// Create single attachment
router.post(
  '/attachments/single',
  authorizeGlobalRole(GlobalRole.USER),
  checkEntityType,
  checkProjectMembership(),
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
  checkEntityType,
  checkProjectMembership(),
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
  checkEntityType,
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.USER, { allowGlobalSuperAdmin: true }),
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
  checkEntityType,
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.USER, { allowGlobalSuperAdmin: true }),
  checkMultipleAttachmentOwnership(prisma) as RequestHandler,
  deleteManyAttachmentMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteManyAttachments(req, res, next, prisma);
  }
);

// Download attachment
router.get(
  '/attachments/:id/download',
  authorizeGlobalRole(GlobalRole.USER),
  checkEntityType,
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.USER, { allowGlobalSuperAdmin: true }),
  downloadSingleAttachmentMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await downloadSingleAttachment(req, res, next, prisma);
  }
);

// Download multiple attachments by Entity/Id
router.post(
  '/attachments/download',
  authorizeGlobalRole(GlobalRole.USER),
  checkEntityType,
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.USER, { allowGlobalSuperAdmin: true }),
  downloadMultipleAttachmentMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await downloadMultipleAttachments(req, res, next, prisma);
  }
);

export default router;
