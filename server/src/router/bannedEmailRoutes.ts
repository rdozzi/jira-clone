import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  getAllBannedEmails,
  getBannedEmailById,
  createBannedEmail,
  deleteBannedEmail,
} from '../controllers/bannedEmailController';
import { authorizeOrganizationRole } from '../middleware/authAndLoadInfoMiddleware/authorizeOrganizationRole';
import { OrganizationRole } from '@prisma/client';
import { validateParams } from '../middleware/validation/validateParams';
import { bannedEmailCreateSchema } from '../schemas/bannedEmail.schema';
import { validateBody } from '../middleware/validation/validateBody';
import { checkMaxUsageTotals } from '../middleware/organizationUsageMiddleware/checkMaxUsageTotals';

const router = Router();

// Get all banned emails
router.get(
  '/bannedEmails',
  authorizeOrganizationRole(OrganizationRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllBannedEmails(req, res, prisma);
  }
);

// Get banned email by Id
router.get(
  '/bannedEmails/:bannedEmailId',
  authorizeOrganizationRole(OrganizationRole.ADMIN),
  validateParams,
  async (req: Request, res: Response): Promise<void> => {
    await getBannedEmailById(req, res, prisma);
  }
);

// Create banned email
router.post(
  '/bannedEmails',
  authorizeOrganizationRole(OrganizationRole.ADMIN),
  validateBody(bannedEmailCreateSchema),
  checkMaxUsageTotals(prisma),
  async (req: Request, res: Response): Promise<void> => {
    await createBannedEmail(req, res, prisma);
  }
);

// Delete banned email
router.delete(
  '/bannedEmails/:emailId',
  authorizeOrganizationRole(OrganizationRole.ADMIN),
  validateParams,
  async (req: Request, res: Response): Promise<void> => {
    await deleteBannedEmail(req, res, prisma);
  }
);

export default router;
