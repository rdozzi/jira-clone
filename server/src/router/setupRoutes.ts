import { Request, Response, Router } from 'express';
import prisma from '../lib/prisma';
import { seedOrganizationAndSuperAdmin } from '../controllers/setupController';
import { validateBody } from '../middleware/validation/validateBody';
import {
  seedSuperAdminSchema,
  seedSuperUserSchema,
} from '../schemas/setup.schema';

const router = Router();

router.post(
  '/setup/seedSuperAdmin',
  validateBody(seedSuperAdminSchema),
  async (req: Request, res: Response): Promise<void> => {
    await seedOrganizationAndSuperAdmin(req, res, prisma);
  }
);

router.post(
  '/setup/seedSuperUser',
  validateBody(seedSuperUserSchema),
  async (req: Request, res: Response): Promise<void> => {
    await seedOrganizationAndSuperAdmin(req, res, prisma);
  }
);

export default router;
