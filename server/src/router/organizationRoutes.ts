import prisma from '../lib/prisma';
import { Router, Request, Response } from 'express';
import { OrganizationRole } from '@prisma/client';
import { getOrganization } from '../controllers/organizationController';
import { authorizeOrganizationRole } from '../middleware/authAndLoadInfoMiddleware/authorizeOrganizationRole';

const router = Router();

router.get(
  '/organization',
  authorizeOrganizationRole(OrganizationRole.GUEST),
  async (req: Request, res: Response): Promise<void> => {
    await getOrganization(req, res, prisma);
  },
);

export default router;
