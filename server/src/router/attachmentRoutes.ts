import { Router, Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import { AttachmentEntityType, GlobalRole, ProjectRole } from '@prisma/client';
import prisma from '../lib/prisma';

// Middleware imports
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';

import { resolveProjectIdForCreateAttachment } from '../middleware/attachments/resolveProjectIdForCreateAttachment';
import { resolveProjectIdForGetAttachments } from '../middleware/attachments/resolveProjectIdForGetAttachments';
import { resolveProjectIdForSingleDeletionAndDownload } from '../middleware/attachments/resolveProjectIdForSingleDeletionAndDownload';
import { resolveProjectIdForMultipleDeletionAndDownload } from '../middleware/attachments/resolveProjectIdForMultipleDeletionAndDownload';
import {
  uploadSingleMiddleware,
  uploadMultipleMiddleware,
} from '../middleware/attachments/uploadMiddleware';
import { validateAttachmentExistsAndStore } from '../middleware/attachments/validateAttachmentExistsAndStore';
import { checkTicketOrCommentOwnershipForAttachments } from '../middleware/attachments/checkTicketAndCommentOwnershipForAttachments';
import { checkBoardAndProjectAccess } from '../middleware/attachments/checkBoardAndProjectAccess';
import { loadEntityIdAndEntityTypeForUpload } from '../middleware/attachments/loadEntityIdAndEntityTypeForUpload';
import { loadEntityIdAndEntityTypeForSingleDeletion } from '../middleware/attachments/loadEntityIdAndEntityTypeForSingleDeletion';
import { validateAndSetAttachmentDeleteAndDownloadParams } from '../middleware/attachments/validateAndSetAttachmentDeleteAndDownloadParams';

// Controller Functions
import { getAllAttachments } from '../controllers/attachmentControllers/getAllAttachments';
import {
  handleSingleUpload,
  handleMultipleUpload,
} from '../controllers/attachmentControllers/uploadController';
import { deleteManyAttachments } from '../controllers/attachmentControllers/deleteManyAttachmentsController';
import { deleteAttachment } from '../controllers/attachmentControllers/deleteAttachmentController';
import { downloadSingleAttachment } from '../controllers/attachmentControllers/downloadController';
import { downloadMultipleAttachments } from '../controllers/attachmentControllers/downloadMultipleAttachmentsController';

const router = Router();

// Get all attachments
// No payload. Database call only. Get all
router.get(
  '/attachments',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllAttachments(req, res, prisma);
  }
);

// Get all attachments by Entity/Id
// params: {"entityType": Entity, "entityId": Number}

const enumPattern = Object.values(AttachmentEntityType).join('|');
router.get(
  `/attachments/:entityType(${enumPattern})/:entityId(\\d+)`,
  authorizeGlobalRole(GlobalRole.USER),
  resolveProjectIdForGetAttachments(prisma),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.VIEWER, { allowGlobalSuperAdmin: true }),
  async (req: Request, res: Response): Promise<void> => {
    await getAllAttachments(req, res, prisma);
  }
);

// Create single attachment
// Body/Form-Data (Multer Required): {file, entityType, entityId}
router.post(
  '/attachments/single',
  authorizeGlobalRole(GlobalRole.USER),
  uploadSingleMiddleware,
  resolveProjectIdForCreateAttachment(prisma),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.USER),
  loadEntityIdAndEntityTypeForUpload,
  checkTicketOrCommentOwnershipForAttachments,
  checkBoardAndProjectAccess,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await handleSingleUpload(req as CustomRequest, res, next, prisma);
  }
);

// Create several attachments
// Body/Form-Data (Multer Required): {files, entityType, entityId}
router.post(
  '/attachments/many',
  authorizeGlobalRole(GlobalRole.USER),
  uploadMultipleMiddleware,
  resolveProjectIdForCreateAttachment(prisma),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.USER),
  loadEntityIdAndEntityTypeForUpload,
  checkTicketOrCommentOwnershipForAttachments,
  checkBoardAndProjectAccess,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await handleMultipleUpload(req as CustomRequest, res, next, prisma);
  }
);

// Delete attachment by attachmentId
// Params: :attachmentId
router.delete(
  '/attachments/:attachmentId',
  authorizeGlobalRole(GlobalRole.USER),
  validateAttachmentExistsAndStore,
  resolveProjectIdForSingleDeletionAndDownload(prisma),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.USER, { allowGlobalSuperAdmin: true }),
  loadEntityIdAndEntityTypeForSingleDeletion,
  checkTicketOrCommentOwnershipForAttachments,
  checkBoardAndProjectAccess,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteAttachment(req as CustomRequest, res, next, prisma);
  }
);

// Delete many attachments
// Body: Array of Id values (attachmentIds), entityId, entityType
router.delete(
  '/attachments',
  authorizeGlobalRole(GlobalRole.USER),
  validateAndSetAttachmentDeleteAndDownloadParams,
  resolveProjectIdForMultipleDeletionAndDownload(prisma),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.USER, { allowGlobalSuperAdmin: true }),
  checkTicketOrCommentOwnershipForAttachments,
  checkBoardAndProjectAccess,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteManyAttachments(req, res, next, prisma);
  }
);

// Download attachment by attachmentId
// Params: :attachmentId
router.get(
  '/attachments/:attachmentId(\\d+)/download',
  authorizeGlobalRole(GlobalRole.USER),
  validateAttachmentExistsAndStore,
  resolveProjectIdForSingleDeletionAndDownload(prisma),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.USER, { allowGlobalSuperAdmin: true }),
  async (req: Request, res: Response): Promise<void> => {
    await downloadSingleAttachment(req, res);
  }
);

// Download multiple attachments by EntityId
// Body: Array of Ids (attachmentIds), entityId, entityType
router.post(
  '/attachments/download',
  authorizeGlobalRole(GlobalRole.USER),
  validateAndSetAttachmentDeleteAndDownloadParams,
  resolveProjectIdForMultipleDeletionAndDownload(prisma),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.USER, { allowGlobalSuperAdmin: true }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await downloadMultipleAttachments(req, res, next, prisma);
  }
);

export default router;
