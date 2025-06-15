import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { CustomRequest } from '../types/CustomRequest';
import { GlobalRole, ProjectRole } from '@prisma/client';
import prisma from '../lib/prisma';

// Middleware imports
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';

import { checkEntityType } from '../middleware/attachments/checkEntityType';
import {
  uploadSingleMiddleware,
  uploadMultipleMiddleware,
} from '../middleware/attachments/uploadMiddleware';
import { deleteManyAttachmentMiddleware } from '../middleware/attachments/deleteManyAttachmentMiddleware';
import { validateAttachmentExists } from '../middleware/attachments/deleteAttachmentMiddleware';
import { downloadSingleAttachmentMiddleware } from '../middleware/attachments/downloadSingleMiddleware';
import { downloadMultipleAttachmentMiddleware } from '../middleware/attachments/downloadMultipleMiddleware';
import { checkTicketOrCommentOwnershipForAttachments } from '../middleware/attachments/checkTicketAndCommentOwnershipForAttachments';
import { checkBoardAndProjectAccess } from '../middleware/attachments/checkBoardAndProjectAccess';

// Controller Functions
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
  checkTicketOrCommentOwnershipForAttachments,
  checkBoardAndProjectAccess,
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
  checkTicketOrCommentOwnershipForAttachments,
  checkBoardAndProjectAccess,
  uploadMultipleMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await handleMultipleUpload(req as CustomRequest, res, next, prisma);
  }
);

// Delete attachment
router.delete(
  '/attachments/:entityId',
  authorizeGlobalRole(GlobalRole.USER),
  checkEntityType,
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.USER, { allowGlobalSuperAdmin: true }),
  checkTicketOrCommentOwnershipForAttachments,
  checkBoardAndProjectAccess,
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
  checkTicketOrCommentOwnershipForAttachments,
  checkBoardAndProjectAccess,
  deleteManyAttachmentMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteManyAttachments(req, res, next, prisma);
  }
);

// Download attachment by EntityId
router.get(
  '/attachments/:entityId/download',
  authorizeGlobalRole(GlobalRole.USER),
  checkEntityType,
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.USER, { allowGlobalSuperAdmin: true }),
  downloadSingleAttachmentMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await downloadSingleAttachment(req, res, next, prisma);
  }
);

// Download multiple attachments by EntityId
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
