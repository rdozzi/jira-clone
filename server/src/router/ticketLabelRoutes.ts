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
import { validateParams } from '../middleware/validation/validateParams';
import { validateMultipleParams } from '../middleware/validation/validateMultipleParams';

const router = Router();

// View ticket_label relationship by ticket
router.get(
  '/ticket-labels/:ticketId',
  resolveProjectIdForTicketRoute(),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.VIEWER, { allowGlobalSuperAdmin: true }),
  validateParams,
  getLabelByTicket(prisma)
);

// Add label to ticket
router.post(
  '/ticket-labels/:ticketId/:labelId',
  resolveProjectIdForTicketRoute(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.USER),
  validateMultipleParams,
  addLabelToTicket(prisma)
);

// Remove label from ticket
router.delete(
  '/ticket-labels/:ticketId/:labelId',
  resolveProjectIdForTicketRoute(),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.VIEWER, { allowGlobalSuperAdmin: true }),
  validateMultipleParams,
  deleteLabelFromTicket(prisma)
);

export default router;
