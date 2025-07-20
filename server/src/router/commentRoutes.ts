import { Router, Request, Response } from 'express';
import { GlobalRole, ProjectRole } from '@prisma/client';
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import { checkCommentOwnership } from '../middleware/commentMiddleware/checkCommentOwnership';
import prisma from '../lib/prisma';
import {
  getAllComments,
  getCommentsByTicketId,
  createComment,
  deleteComment,
  updateComment,
} from '../controllers/commentController';
import { resolveProjectIdFromComment } from '../middleware/commentMiddleware/resolveProjectIdFromComment';
import { validateBody } from '../middleware/validation/validateBody';
import { createCommentSchema } from '../schemas/comment.schema';
import { updateUserSchema } from '../schemas/comment.schema';
import { validateParams } from '../middleware/validation/validateParams';

const router = Router();

// Get all comments
router.get(
  '/comments',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllComments(req, res, prisma);
  }
);

// Get comments for a specific ticket
router.get(
  '/comments/:ticketId',
  resolveProjectIdFromComment(),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.VIEWER, { allowGlobalSuperAdmin: true }),
  validateParams,
  async (req: Request, res: Response): Promise<void> => {
    await getCommentsByTicketId(req, res, prisma);
  }
);

// Create a comment
router.post(
  '/comments',
  resolveProjectIdFromComment(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.USER),
  validateBody(createCommentSchema),
  async (req: Request, res: Response): Promise<void> => {
    await createComment(req, res, prisma);
  }
);

// Delete comment
router.delete(
  '/comments/:commentId',
  resolveProjectIdFromComment(),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.USER, { allowGlobalSuperAdmin: true }),
  checkCommentOwnership({ allowGlobalSuperAdmin: true }),
  validateParams,
  async (req: Request, res: Response): Promise<void> => {
    await deleteComment(req, res, prisma);
  }
);

// Update comment
router.patch(
  '/comments/:commentId',
  resolveProjectIdFromComment(),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.USER, { allowGlobalSuperAdmin: true }),
  checkCommentOwnership({ allowGlobalSuperAdmin: true }),
  validateParams,
  validateBody(updateUserSchema),
  async (req: Request, res: Response): Promise<void> => {
    await updateComment(req, res, prisma);
  }
);

export default router;
