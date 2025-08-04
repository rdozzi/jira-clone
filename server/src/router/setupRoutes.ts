import { Request, Response, Router } from 'express';
import prisma from '../lib/prisma';
import {
  seedOrganizationAndSuperAdmin,
  // seedSuperUser,
} from '../controllers/setupController';
import { validateBody } from '../middleware/validation/validateBody';
import {
  seedOrganizationSchema,
  // seedSuperUserSchema,
} from '../schemas/setup.schema';
import { verifyRecaptchaToken } from '../middleware/setupMiddleware/verifyRecaptchaToken';
import { verifyOTP } from '../middleware/setupMiddleware/verifyOTP';
import { verifyEmail } from '../middleware/setupMiddleware/verifyEmail';
import { attemptCountLimiter } from '../middleware/setupMiddleware/attemptCountLimiter';
import { isBlocked } from '../middleware/setupMiddleware/isBlocked';
import { checkHoneypot } from '../middleware/setupMiddleware/checkHoneypot';
import { checkDisposableDomains } from '../middleware/setupMiddleware/checkDisposableDomains';

const router = Router();

router.post(
  '/seedOrganizationAndSuperAdmin',
  checkHoneypot(),
  validateBody(seedOrganizationSchema),
  isBlocked(),
  verifyRecaptchaToken(),
  attemptCountLimiter(),
  checkDisposableDomains(),
  verifyEmail(),
  verifyOTP(),
  async (req: Request, res: Response): Promise<void> => {
    await seedOrganizationAndSuperAdmin(req, res, prisma);
  }
);

// router.post(
//   '/seedSuperUser',
//   validateBody(seedSuperUserSchema),
//   async (req: Request, res: Response): Promise<void> => {
//     await seedSuperUser(req, res, prisma);
//   }
// );

export default router;
