import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { OrganizationRole, ProjectRole } from '@prisma/client';
import { authorizeOrganizationRole } from '../middleware/authAndLoadInfoMiddleware/authorizeOrganizationRole';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import { authorizeSelfOrAdminWithRoleCheck } from '../middleware/userMiddleware/authorizeSelfOrAdminWithRoleCheck';
import { resolveProjectIdForUserRoutes } from '../middleware/userMiddleware/resolveProjectIdForUserRoutes';
import {
  getAllUsers,
  getUser,
  getUserByProjectId,
  createUser,
  deleteUser,
  updateUser,
  getUserSelf,
} from '../controllers/userController';
import { validateQuery } from '../middleware/validation/validateQuery';
import { validateParams } from '../middleware/validation/validateParams';
import { validateBody } from '../middleware/validation/validateBody';
import { userCreateSchema, userUpdateSchema } from '../schemas/user.schema';
import { checkMaxUsageTotals } from '../middleware/organizationUsageMiddleware/checkMaxUsageTotals';

const router = Router();

// Get all users
router.get(
  '/users/all',
  authorizeOrganizationRole(OrganizationRole.USER),
  async (req: Request, res: Response): Promise<void> => {
    await getAllUsers(req, res, prisma);
  }
);

// Get users by id or email
router.get(
  `/users`,
  authorizeOrganizationRole(OrganizationRole.ADMIN),
  validateQuery,
  async (req: Request, res: Response): Promise<void> => {
    await getUser(req, res, prisma);
  }
);

// Get user self
router.get(
  `/users/self`,
  authorizeOrganizationRole(OrganizationRole.GUEST),
  async (req: Request, res: Response): Promise<void> => {
    await getUserSelf(req, res, prisma);
  }
);

// Get users by project
router.get(
  '/users/:projectId/project',
  resolveProjectIdForUserRoutes(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.VIEWER),
  validateParams,
  async (req: Request, res: Response) => {
    await getUserByProjectId(req, res, prisma);
  }
);

// Create user
router.post(
  '/users',
  authorizeOrganizationRole(OrganizationRole.ADMIN),
  validateBody(userCreateSchema),
  checkMaxUsageTotals(prisma),
  async (req: Request, res: Response): Promise<void> => {
    await createUser(req, res, prisma);
  }
);

// Delete user
router.patch(
  '/users/:userId/soft-delete',
  authorizeOrganizationRole(OrganizationRole.ADMIN),
  validateParams,
  async (req: Request, res: Response): Promise<void> => {
    await deleteUser(req, res, prisma);
  }
);

// Update user info
router.patch(
  '/users/:userId/update',
  authorizeSelfOrAdminWithRoleCheck(),
  validateParams,
  validateBody(userUpdateSchema),
  async (req: Request, res: Response): Promise<void> => {
    await updateUser(req, res, prisma);
  }
);

export default router;
