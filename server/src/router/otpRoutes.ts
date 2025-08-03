import { Router, Request, Response } from 'express';
import { createOTPHash } from '../controllers/otpController';

const router = Router();

router.get('/otpRoute', async (req: Request, res: Response): Promise<void> => {
  await createOTPHash(req, res);
});

export default router;
