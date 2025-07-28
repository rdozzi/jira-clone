import prisma from '../lib/prisma';
import { Router, Request, Response } from 'express';
import { requireGlobalSuperUser } from '../middleware/superUserMiddleware/requireGlobalSuperUser';
import { validateParams } from '../middleware/validation/validateParams';
import { validateQuery } from '../middleware/validation/validateQuery';
import { validateBody } from '../middleware/validation/validateBody';
import { updateSuperUserSchema } from '../schemas/superUser.schema';
import { uploadSingleMiddleware } from '../middleware/attachments/uploadMiddleware';
import {
  getSuperUsers,
  updateSuperUser,
  updateSuperUserAvatar,
  deleteSuperUser,
} from '../controllers/superUserProfileController';
import { checkSuperUserSelf } from '../middleware/superUserMiddleware/checkSuperUserSelf';

const router = Router();

router.use(requireGlobalSuperUser());

//get(all)
// Include by Id with query
// Get users by id or email
router.get(
  `/profiles`,
  validateQuery,
  async (req: Request, res: Response): Promise<void> => {
    await getSuperUsers(req, res, prisma);
  }
);

//update
// Disallow demotion with self
router.patch(
  '/profiles/:userId',
  validateParams,
  validateBody(updateSuperUserSchema),
  checkSuperUserSelf(),
  async (req: Request, res: Response): Promise<void> => {
    await updateSuperUser(req, res, prisma);
  }
);

//update avatar
// Allow self or other user
router.patch(
  '/profiles/:userId/avatar',
  uploadSingleMiddleware,
  validateParams,
  checkSuperUserSelf(),
  async (req: Request, res: Response) => {
    await updateSuperUserAvatar(req, res, prisma);
  }
);

//Delete (soft)
export default router;
// Delete user
router.patch(
  '/profiles/:userId/soft-delete',
  validateParams,
  async (req: Request, res: Response): Promise<void> => {
    await deleteSuperUser(req, res, prisma);
  }
);
