import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { CustomRequest } from '../types/CustomRequest';
import prisma from '../lib/prisma';
import { GlobalRole, ProjectRole } from '@prisma/client';
import { authorizeGlobalRole } from '../middleware/authorizeGlobalRole';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import { authorizeSelfOrAdmin } from '../middleware/authorizeSelfOrAdmin';
import {
  getAllUsers,
  getUser,
  getUserByProjectId,
  createUser,
  deleteUser,
  updateUser,
  updateUserAvatar,
} from '../controllers/userController';
import { uploadSingleMiddleware } from '../middleware/uploadMiddleware';

const router = Router();

// Get all users
router.get(
  '/users/all',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllUsers(req, res, prisma);
  }
);

// Get user
router.get(
  '/users',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getUser(req, res, prisma);
  }
);

// Get user by project
router.get(
  '/users/:id/project',
  (req: Request, res: Response, next: NextFunction) =>
    checkProjectMembership(req as CustomRequest, res, next),
  checkProjectRole(ProjectRole.VIEWER),
  async (req: Request, res: Response) => {
    await getUserByProjectId(req as CustomRequest, res, prisma);
  }
);

// Create user
router.post(
  '/users',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await createUser(req, res, next, prisma);
  }
);

// Delete user
router.patch(
  '/users/:id/soft-delete',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteUser(req, res, next, prisma);
  }
);

// Update user info
router.patch(
  '/users/:id/update',
  authorizeSelfOrAdmin as unknown as RequestHandler,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await updateUser(req as CustomRequest, res, next, prisma);
  }
);

// Update user avatar
router.patch(
  '/users/:id/avatar',
  authorizeSelfOrAdmin as unknown as RequestHandler,
  uploadSingleMiddleware,
  async (req: Request, res: Response) => {
    await updateUserAvatar(req, res, prisma);
  }
);

export default router;
