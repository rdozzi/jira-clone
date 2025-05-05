import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} from '../controllers/userController';

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
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await createUser(req, res, next, prisma);
  }
);

// Delete user
router.patch(
  '/users/:id/soft-delete',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await deleteUser(req, res, next, prisma);
  }
);

// Update user info
router.patch(
  '/users/:id/update',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await updateUser(req, res, next, prisma);
  }
);

export default router;
