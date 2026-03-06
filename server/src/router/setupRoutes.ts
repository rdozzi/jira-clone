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
import { checkHoneypotAndTimer } from '../middleware/setupMiddleware/checkHoneypotAndTimer';
import { checkDisposableDomains } from '../middleware/setupMiddleware/checkDisposableDomains';

const router = Router();

router.post(
  '/seedOrganizationAndSuperAdmin',
  checkHoneypotAndTimer(),
  validateBody(seedOrganizationSchema),
  checkDisposableDomains(),
  async (req: Request, res: Response): Promise<void> => {
    await seedOrganizationAndSuperAdmin(req, res, prisma);
  },
);

export default router;
