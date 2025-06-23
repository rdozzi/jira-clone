import { Request, Response, Router } from 'express';
import prisma from '../lib/prisma';
import { seedSuperAdmin } from '../controllers/setupController';

const router = Router();

router.post(
  '/setup/seedSuperAdmin',
  async (req: Request, res: Response): Promise<void> => {
    await seedSuperAdmin(req, res, prisma);
  }
);

export default router;
