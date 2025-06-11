import { Router, Request, Response } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import { ProjectRole } from '@prisma/client';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
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
  checkProjectMembership(),
  checkProjectRole(ProjectRole.VIEWER),
  async (req: Request, res: Response): Promise<void> => {
    await viewProjectMembers(req, res, prisma);
  }
);
export default router;

// Add Project Member
router.post(
  '/projectMembers/:projectId/members',
  checkProjectMembership(),
  checkProjectRole(ProjectRole.VIEWER),
  async (req: Request, res: Response): Promise<void> => {
    await addProjectMember(req as CustomRequest, res, prisma);
  }
);

// Remove Project Member
router.delete(
  '/projectMembers/:projectId/members/:userId',
  checkProjectMembership(),
  checkProjectRole(ProjectRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await removeProjectMember(req as CustomRequest, res, prisma);
  }
);

// Update Project Member Role
router.patch(
  '/projectMembers/:projectId/members/:userId',
  checkProjectMembership(),
  checkProjectRole(ProjectRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await updateProjectMemberRole(req as CustomRequest, res, prisma);
  }
);
