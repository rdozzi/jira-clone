import { Router, Request, Response } from 'express';
import { OrganizationRole, ProjectRole } from '@prisma/client';
import { authorizeOrganizationRole } from '../middleware/authAndLoadInfoMiddleware/authorizeOrganizationRole';
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
import { checkMaxUsageTotals } from '../middleware/organizationUsageMiddleware/checkMaxUsageTotals';
import { resolveProjectIdFromComment } from '../middleware/commentMiddleware/resolveProjectIdFromComment';
import { validateBody } from '../middleware/validation/validateBody';
import { commentCreateSchema } from '../schemas/comment.schema';
import { commentUpdateSchema } from '../schemas/comment.schema';
import { validateParams } from '../middleware/validation/validateParams';

const router = Router();

// Get all comments
router.get(
  '/comments',
  authorizeOrganizationRole(OrganizationRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllComments(req, res, prisma);
  }
);

// Get comments for a specific ticket
router.get(
  '/comments/:ticketId',
  resolveProjectIdFromComment(),
  checkProjectMembership({ allowOrganizationSuperAdmin: true }),
  checkProjectRole(ProjectRole.VIEWER, { allowOrganizationSuperAdmin: true }),
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
  validateBody(commentCreateSchema),
  checkMaxUsageTotals(prisma),
  async (req: Request, res: Response): Promise<void> => {
    await createComment(req, res, prisma);
  }
);

// Delete comment
router.delete(
  '/comments/:commentId',
  resolveProjectIdFromComment(),
  checkProjectMembership({ allowOrganizationSuperAdmin: true }),
  checkProjectRole(ProjectRole.USER, { allowOrganizationSuperAdmin: true }),
  checkCommentOwnership({ allowOrganizationSuperAdmin: true }),
  validateParams,
  async (req: Request, res: Response): Promise<void> => {
    await deleteComment(req, res, prisma);
  }
);

// Update comment
router.patch(
  '/comments/:commentId',
  resolveProjectIdFromComment(),
  checkProjectMembership({ allowOrganizationSuperAdmin: true }),
  checkProjectRole(ProjectRole.USER, { allowOrganizationSuperAdmin: true }),
  checkCommentOwnership({ allowOrganizationSuperAdmin: true }),
  validateParams,
  validateBody(commentUpdateSchema),
  async (req: Request, res: Response): Promise<void> => {
    await updateComment(req, res, prisma);
  }
);

export default router;
