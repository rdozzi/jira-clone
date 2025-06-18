import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { loginUser, logoutUser } from '../controllers/authController';

const router = Router();

// Login user
router.post(
  '/auth/login',
  async (req: Request, res: Response): Promise<void> => {
    await loginUser(req, res, prisma);
  }
);

// Lougout user
router.post(
  '/auth/logout',
  async (req: Request, res: Response): Promise<void> => {
    await logoutUser(req, res);
  }
);
export default router;
