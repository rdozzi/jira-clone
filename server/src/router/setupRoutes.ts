import { Request, Response, Router } from 'express';
import prisma from '../lib/prisma';
import { createOrganizationAndSuperAdmin } from '../controllers/setupController';
import { validateBody } from '../middleware/validation/validateBody';
import {
  seedOrganizationSchema,
  // seedSuperUserSchema,
} from '../schemas/setup.schema';
import { checkHoneypotAndTimer } from '../middleware/setupMiddleware/checkHoneypotAndTimer';
import { checkDisposableDomains } from '../middleware/setupMiddleware/checkDisposableDomains';
import { termsOfServiceCheck } from '../middleware/setupMiddleware/termsOfServiceCheck';

const router = Router();

router.post(
  '/create-organization-and-superadmin',
  checkHoneypotAndTimer(),
  termsOfServiceCheck,
  validateBody(seedOrganizationSchema),
  checkDisposableDomains(),
  async (req: Request, res: Response): Promise<void> => {
    await createOrganizationAndSuperAdmin(req, res, prisma);
  },
);

export default router;
