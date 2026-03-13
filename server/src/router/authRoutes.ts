import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  requestPasswordReset,
  loginUser,
  logoutUser,
  changePasswordPublic,
} from '../controllers/authController';
import { validateBody } from '../middleware/validation/validateBody';
import {
  authCredentialCheckSchema,
  changePasswordPublicSchema,
} from '../schemas/auth.schema';
import { checkForToken } from '../middleware/authAndLoadInfoMiddleware/checkForToken';
import { emailSchema } from '../schemas/base.schema';
import { getUserInfoForPassword } from '../middleware/authAndLoadInfoMiddleware/getUserInfoForPassword';
import { authRateLimiter } from '../middleware/rateLimiter';
import { validateTokenQuery } from '../middleware/validation/validateTokenQuery';
import { getUserInfoFromToken } from '../middleware/authAndLoadInfoMiddleware/getUserInfoFromToken';
import { checkHoneypotForgotPassword } from '../middleware/authAndLoadInfoMiddleware/checkHoneypotForgotPassword';

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

// Request Password Reset (Forgot Password -> RESET_PASSWORD)
router.post(
  '/auth/request-password-reset',
  authRateLimiter,
  checkHoneypotForgotPassword,
  validateBody(emailSchema),
  getUserInfoForPassword,
  async (req: Request, res: Response): Promise<void> => {
    await requestPasswordReset(req, res, prisma);
  },
);

// Change Password Public (RESET_PASSWORD, ACCOUNT_INVITE, ACCOUNT_ACTIVATION)
router.post(
  '/auth/change-password-public',
  authRateLimiter,
  validateTokenQuery,
  validateBody(changePasswordPublicSchema),
  getUserInfoFromToken,
  async (req: Request, res: Response): Promise<void> => {
    await changePasswordPublic(req, res, prisma);
  },
);

export default router;
