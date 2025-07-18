import { Router, Request, Response } from 'express';
import { ProjectRole } from '@prisma/client';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import { resolveProjectIdFromProject } from '../middleware/projectMiddleware/resolveProjectIdFromProject';
import prisma from '../lib/prisma';
import {
  viewProjectMembers,
  addProjectMember,
  removeProjectMember,
  updateProjectMemberRole,
} from '../controllers/projectMemberController';

const router = Router();

// View Project Members
router.get(
  '/projectMembers/:projectId/members',
  resolveProjectIdFromProject(),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.VIEWER, { allowGlobalSuperAdmin: true }),
  async (req: Request, res: Response): Promise<void> => {
    await viewProjectMembers(req, res, prisma);
  }
);

// Add Project Member
router.post(
  '/projectMembers/:projectId/members',
  resolveProjectIdFromProject(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.VIEWER),
  async (req: Request, res: Response): Promise<void> => {
    await addProjectMember(req, res, prisma);
  }
);

// Remove Project Member
router.delete(
  '/projectMembers/:projectId/members/:userId',
  resolveProjectIdFromProject(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await removeProjectMember(req, res, prisma);
  }
);

// Update Project Member Role
router.patch(
  '/projectMembers/:projectId/members/:userId',
  resolveProjectIdFromProject(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await updateProjectMemberRole(req, res, prisma);
  }
);

export default router;
