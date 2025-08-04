import { Request, Response, NextFunction } from 'express';
import { redisClient, connectRedis } from '../../lib/connectRedis';

export function verifyOTP() {
  return async (req: Request, res: Response, next: NextFunction) => {
    await connectRedis();

    const { email, otp } = res.locals.validatedBody;

    const otpKey = `otpPayload:${email}`;
    const blockedEmail = `blockedEmail:${email}`;
    const attemptKey = `attemptPayload:${email}`;
    const otpPayload = await redisClient.hGetAll(otpKey);

    if (
      otpPayload.email !== email ||
      String(otpPayload.otpValue) !== String(otp)
    ) {
      res.status(401).json({ message: 'OTP authentication failed' });
      return;
    }

    await redisClient.del(otpKey);
    await redisClient.del(blockedEmail);
    await redisClient.del(attemptKey);

    next();
  };
}
