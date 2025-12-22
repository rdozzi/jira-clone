// import { Router, Request, Response } from 'express';
// import prisma from '../lib/prisma';
// import {
//   getAllLabels,
//   createNewLabel,
//   updateLabel,
//   deleteLabel,
// } from './labelController.controller';
// import { authorizeOrganizationRole } from '../middleware/authAndLoadInfoMiddleware/authorizeOrganizationRole';
// import { OrganizationRole } from '@prisma/client';
// import { validateCreateLabel } from '../middleware/labelMiddleware/validateCreateLabel';
// import { validateUpdateLabel } from '../middleware/labelMiddleware/validateUpdateLabel';
// import { validateParams } from '../middleware/validation/validateParams';
// import { checkMaxUsageTotals } from '../middleware/organizationUsageMiddleware/checkMaxUsageTotals';

// const router = Router();

// // Get all Labels
// router.get(
//   '/labels',
//   authorizeOrganizationRole(OrganizationRole.ADMIN),
//   async (req: Request, res: Response): Promise<void> => {
//     await getAllLabels(req, res, prisma);
//   }
// );

// // Create new Label
// router.post(
//   '/labels',
//   authorizeOrganizationRole(OrganizationRole.ADMIN),
//   validateCreateLabel,
//   checkMaxUsageTotals(prisma),
//   async (req: Request, res: Response): Promise<void> => {
//     await createNewLabel(req, res, prisma);
//   }
// );

// // Update Label
// router.patch(
//   '/labels/:labelId',
//   authorizeOrganizationRole(OrganizationRole.ADMIN),
//   validateUpdateLabel,
//   validateParams,
//   async (req: Request, res: Response): Promise<void> => {
//     await updateLabel(req, res, prisma);
//   }
// );

// // Delete Label
// router.delete(
//   '/labels/:labelId',
//   authorizeOrganizationRole(OrganizationRole.ADMIN),
//   validateParams,
//   async (req: Request, res: Response): Promise<void> => {
//     await deleteLabel(req, res, prisma);
//   }
// );

// export default router;
