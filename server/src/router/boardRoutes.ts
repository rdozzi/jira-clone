import { Router, Request, Response } from 'express';
import { GlobalRole, ProjectRole } from '@prisma/client';
import { authorizeGlobalRole } from '../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole';
import { checkProjectMembership } from '../middleware/checkProjectMembership';
import { checkProjectRole } from '../middleware/checkProjectRole';
import { resolveProjectIdFromBoard } from '../middleware/boardMiddleware/resolveProjectIdFromBoard';
import prisma from '../lib/prisma';
import {
  getAllBoards,
  // getBoardById,
  getBoardsByProjectId,
  createBoard,
  updateBoard,
  deleteBoard,
} from '../controllers/boardController';

const router = Router();

// Get all Boards
router.get(
  '/boards',
  authorizeGlobalRole(GlobalRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await getAllBoards(req, res, prisma);
  }
);

// Get board by Id
// router.get(
//   '/boards/:boardId',
//   authorizeGlobalRole(GlobalRole.ADMIN),
//   async (req: Request, res: Response): Promise<void> => {
//     await getBoardById(req, res, prisma);
//   }
// );

// Get boards by Project Id
router.get(
  '/boards/:projectId/project',
  resolveProjectIdFromBoard(),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.VIEWER, { allowGlobalSuperAdmin: true }),
  async (req: Request, res: Response): Promise<void> => {
    await getBoardsByProjectId(req, res, prisma);
  }
);

// Create board
router.post(
  '/boards',
  resolveProjectIdFromBoard(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await createBoard(req, res, prisma);
  }
);

// Update board
router.patch(
  '/boards/:boardId',
  resolveProjectIdFromBoard(),
  checkProjectMembership(),
  checkProjectRole(ProjectRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await updateBoard(req, res, prisma);
  }
);

// Delete board
router.delete(
  '/boards/:boardId',
  resolveProjectIdFromBoard(),
  checkProjectMembership({ allowGlobalSuperAdmin: true }),
  checkProjectRole(ProjectRole.ADMIN, { allowGlobalSuperAdmin: true }),
  async (req: Request, res: Response): Promise<void> => {
    await deleteBoard(req, res, prisma);
  }
);

export default router;
