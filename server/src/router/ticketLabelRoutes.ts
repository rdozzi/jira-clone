import { Router } from 'express';
import { ProjectRole } from '@prisma/client';
import { resolveProjectIdForTicketRoute } from '../middleware/ticketMiddleware/resolveProjectIdForTicketRoute';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import {
  getLabelByTicket,
  addLabelToTicket,
  deleteLabelFromTicket,
} from '../controllers/ticketLabelController';
import prisma from '../lib/prisma';

const router = Router();

// View ticket_label relationship by ticket
router.get(
  '/ticket-labels/:ticketId',
  resolveProjectIdForTicketRoute(),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.VIEWER, { allowGlobalSuperAdmin: true }),
  getLabelByTicket(prisma)
);

// Add label to ticket
router.post(
  '/ticket-labels/:ticketId/:labelId',
  resolveProjectIdForTicketRoute(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.USER),
  addLabelToTicket(prisma)
);

// Remove label from ticket
router.delete(
  '/ticket-labels/:ticketId/:labelId',
  resolveProjectIdForTicketRoute(),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.VIEWER, { allowGlobalSuperAdmin: true }),
  deleteLabelFromTicket(prisma)
);

export default router;
