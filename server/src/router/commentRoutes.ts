import { Router, Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import { GlobalRole, ProjectRole } from '@prisma/client';
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import { checkCommentOwnership } from '../middleware/checkCommentOwnership';
import prisma from '../lib/prisma';
import {
  getAllComments,
  getAllCommentsById,
  createComment,
  deleteComment,
  updateComment,
} from '../controllers/commentController';

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
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.VIEWER),
  async (req: Request, res: Response): Promise<void> => {
    await getAllCommentsById(req, res, prisma);
  }
);

// Create a comment
router.post(
  '/comments',
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.USER),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await createComment(req as CustomRequest, res, next, prisma);
  }
);

// Delete comment
router.delete(
  '/comments/:id',
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.USER),
  checkCommentOwnership(prisma),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteComment(req as CustomRequest, res, next, prisma);
  }
);

// Update comment
router.patch(
  '/comments/:commentId',
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.USER),
  checkCommentOwnership(prisma),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await updateComment(req as CustomRequest, res, next, prisma);
  }
);

export default router;
