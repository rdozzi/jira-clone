import { Router, Request, Response } from 'express';
import { createOTPHash } from './otpController';
import { validateBody } from '../middleware/validation/validateBody';
import { createOTPHashSchema } from './otp.schema';

const router = Router();

router.get(
  '/otpRoute',
  validateBody(createOTPHashSchema),
  async (req: Request, res: Response): Promise<void> => {
    await createOTPHash(req, res);
  },
);

export default router;
