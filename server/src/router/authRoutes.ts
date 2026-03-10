import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  requestPasswordReset,
  loginUser,
  logoutUser,
} from '../controllers/authController';
import { validateBody } from '../middleware/validation/validateBody';
import { authCredentialCheckSchema } from '../schemas/auth.schema';
import { checkForToken } from '../middleware/authAndLoadInfoMiddleware/checkForToken';
import { emailSchema } from '../schemas/base.schema';
import { getUserInfoForPassword } from '../middleware/authAndLoadInfoMiddleware/getUserInfoForPassword';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Login user
router.post(
  '/login',
  validateBody(authCredentialCheckSchema),
  async (req: Request, res: Response): Promise<void> => {
    await loginUser(req, res, prisma);
  },
);

// Logout user
router.post(
  '/logout',
  checkForToken,
  async (req: Request, res: Response): Promise<void> => {
    await logoutUser(req, res);
  },
);

// Request Password Reset (Forgot)
router.post(
  '/auth/request-password-reset',
  authRateLimiter,
  validateBody(emailSchema),
  getUserInfoForPassword,
  async (req: Request, res: Response): Promise<void> => {
    await requestPasswordReset(req, res, prisma);
  },
);

export default router;
