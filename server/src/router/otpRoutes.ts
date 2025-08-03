import { Router, Request, Response } from 'express';
import { createOTPHash } from '../controllers/otpController';
import { validateBody } from '../middleware/validation/validateBody';
import { createOTPHashSchema } from '../schemas/otp.schema';

const router = Router();

router.get(
  '/otpRoute',
  validateBody(createOTPHashSchema),
  async (req: Request, res: Response): Promise<void> => {
    await createOTPHash(req, res);
  }
);

export default router;
