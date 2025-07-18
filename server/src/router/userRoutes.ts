import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { GlobalRole, ProjectRole } from '@prisma/client';
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import { authorizeSelfOrAdminWithRoleCheck } from '../middleware/userMiddleware/authorizeSelfOrAdminWithRoleCheck';
import { resolveProjectIdForUserRoutes } from '../middleware/userMiddleware/resolveProjectIdForUserRoutes';
import {
  getAllUsers,
  getUser,
  getUserByProjectId,
  createUser,
  deleteUser,
  updateUser,
  updateUserAvatar,
} from '../controllers/userController';
import { uploadSingleMiddleware } from '../middleware/attachments/uploadMiddleware';

const router = Router();

// Get all users
router.get(
  '/users/all',
  authorizeGlobalRole(GlobalRole.USER),
  async (req: Request, res: Response): Promise<void> => {
    await getAllUsers(req, res, prisma);
  }
);

// Get users by id or email
router.get(
  `/users`,
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getUser(req, res, prisma);
  }
);

// Get users by project
router.get(
  '/users/:projectId/project',
  resolveProjectIdForUserRoutes(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.VIEWER),
  async (req: Request, res: Response) => {
    await getUserByProjectId(req, res, prisma);
  }
);

// Create user
router.post(
  '/users',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await createUser(req, res, prisma);
  }
);

// Delete user
router.patch(
  '/users/:userId/soft-delete',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await deleteUser(req, res, prisma);
  }
);

// Update user info
router.patch(
  '/users/:userId/update',
  authorizeSelfOrAdminWithRoleCheck(),
  async (req: Request, res: Response): Promise<void> => {
    await updateUser(req, res, prisma);
  }
);

// Update user avatar
router.patch(
  '/users/:userId/avatar',
  authorizeSelfOrAdminWithRoleCheck(),
  uploadSingleMiddleware,
  async (req: Request, res: Response) => {
    await updateUserAvatar(req, res, prisma);
  }
);

export default router;
