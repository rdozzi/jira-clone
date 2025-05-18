import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { loginUser, logoutUser } from '../controllers/authController';

const router = Router();

// Login user
router.post(
  '/auth/login',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await loginUser(req, res, next, prisma);
  }
);

// Lougout user
router.post(
  '/auth/logout',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await logoutUser(req, res, next);
  }
);
export default router;
