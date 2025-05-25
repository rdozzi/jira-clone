import { Router, Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import prisma from '../lib/prisma';
import {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  updateUserAvatar,
} from '../controllers/userController';
import { uploadSingleMiddleware } from '../middleware/uploadMiddleware';
import { authorizeGlobalRole } from '../middleware/authorizeGlobalRole';
import { GlobalRole } from '@prisma/client';

const router = Router();

// Get all users
router.get('/users/all', async (req: Request, res: Response): Promise<void> => {
  await getAllUsers(req, res, prisma);
});

// Get user
router.get('/users', async (req: Request, res: Response): Promise<void> => {
  await getUser(req, res, prisma);
});

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
  authorizeGlobalRole(GlobalRole.USER),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await updateUser(req as CustomRequest, res, next, prisma);
  }
);

// Update user avatar
router.patch(
  '/users/:id/avatar',
  authorizeGlobalRole(GlobalRole.USER),
  uploadSingleMiddleware,
  async (req: Request, res: Response) => {
    await updateUserAvatar(req, res, prisma);
  }
);

export default router;
