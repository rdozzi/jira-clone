import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
} from '../controllers/userController';

const router = Router();

// Get all users
router.get('/users', async (req: Request, res: Response): Promise<void> => {
  await getAllUsers(req, res, prisma);
});

// Get user by Id
router.get('/users/:id', async (req: Request, res: Response): Promise<void> => {
  await getUserById(req, res, prisma);
});

// Create user
router.post('/', async (req: Request, res: Response): Promise<void> => {
  await createUser(req, res, prisma);
});

router.delete(
  '/users/:id',
  async (req: Request, res: Response): Promise<void> => {
    await deleteUser(req, res, prisma);
  }
);

export default router;
