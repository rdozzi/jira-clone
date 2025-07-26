import { Router, Request, Response } from 'express';
import { OrganizationRole, ProjectRole } from '@prisma/client';
import { resolveProjectIdFromProject } from '../middleware/projectMiddleware/resolveProjectIdFromProject';
import prisma from '../lib/prisma';

import {
  getAllProjects,
  // getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByUserId,
} from '../controllers/projectController';

// Middleware
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import { validateBody } from '../middleware/validation/validateBody';
import { validateParams } from '../middleware/validation/validateParams';
import {
  projectCreateSchema,
  projectUpdateSchema,
} from '../schemas/project.schema';

const router = Router();

// Get all projects
router.get(
  '/projects',
  authorizeGlobalRole(OrganizationRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllProjects(req, res, prisma);
  }
);

// Get projects by userId
router.get(
  '/projects/my-projects',
  authorizeGlobalRole(OrganizationRole.GUEST),
  async (req: Request, res: Response): Promise<void> => {
    await getProjectsByUserId(req, res, prisma);
  }
);
// Get project by Id
// router.get(
//   '/projects/:projectId',
//   resolveProjectIdFromProject(),
//   checkProjectMembership({ allowGlobalSuperAdmin: true }),
//   checkProjectRole(ProjectRole.VIEWER, { allowGlobalSuperAdmin: true }),
//   async (req: Request, res: Response): Promise<void> => {
//     await getProjectById(req, res, prisma);
//   }
// );

// Create project (Become a member of project)
router.post(
  '/projects',
  authorizeGlobalRole(OrganizationRole.ADMIN),
  validateBody(projectCreateSchema),
  async (req: Request, res: Response): Promise<void> => {
    await createProject(req, res, prisma);
  }
);

// Update project
router.patch(
  '/projects/:projectId',
  resolveProjectIdFromProject(),
  checkProjectMembership({ allowOrganizationSuperAdmin: true }),
  checkProjectRole(ProjectRole.ADMIN, { allowOrganizationSuperAdmin: true }),
  validateBody(projectUpdateSchema),
  validateParams,
  async (req: Request, res: Response): Promise<void> => {
    await updateProject(req, res, prisma);
  }
);

// Delete project
router.delete(
  '/projects/:projectId',
  resolveProjectIdFromProject(),
  checkProjectMembership({ allowOrganizationSuperAdmin: true }),
  checkProjectRole(ProjectRole.ADMIN, { allowOrganizationSuperAdmin: true }),
  validateParams,
  async (req: Request, res: Response): Promise<void> => {
    await deleteProject(req, res, prisma);
  }
);

export default router;
