import { Request, Response, NextFunction } from 'express';
import { redisClient, connectRedis } from '../../lib/connectRedis';
import { deleteKeysService } from '../../services/setupServices/deleteKeysService';

export function verifyOTP() {
  return async (req: Request, res: Response, next: NextFunction) => {
    await connectRedis();

    const timeInSeconds = 60 * 60 * 24; // 1 day
    const { email, otp } = res.locals.validatedBody;

    const otpKey = `otpPayload:${email}`;
    await redisClient.expire(otpKey, timeInSeconds, 'NX');
    const otpPayload = await redisClient.hGetAll(otpKey);

    if (
      otpPayload.email !== email ||
      String(otpPayload.otpValue) !== String(otp)
    ) {
      res.status(401).json({ message: 'OTP authentication failed' });
      return;
    }

    await deleteKeysService(email);

    next();
  };
}
