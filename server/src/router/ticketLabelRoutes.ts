import { Router } from 'express';
import { ProjectRole } from '@prisma/client';
import { resolveProjectIdFromTicket } from '../middleware/ticketMiddleware/resolveProjectIdFromTicket';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import {
  getLabelByTicket,
  addLabelToTicket,
} from '../controllers/ticketLabelController';
import prisma from '../lib/prisma';

const router = Router();

// View ticket_label relationship by ticket
router.get(
  '/ticket-labels/:ticketId',
  resolveProjectIdFromTicket(),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.VIEWER, { allowGlobalSuperAdmin: true }),
  async (): Promise<void> => {
    await getLabelByTicket(prisma);
  }
);

// Add label to ticket
router.post(
  '/ticket-labels/:ticketId/:labelId',
  resolveProjectIdFromTicket(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.USER),
  async (): Promise<void> => {
    await addLabelToTicket(prisma);
  }
);
// Remove label from ticket

export default router;
