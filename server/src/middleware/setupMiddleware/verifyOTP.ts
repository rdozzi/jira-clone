import { Request, Response, NextFunction } from 'express';
import { redisClient, connectRedis } from '../../lib/connectRedis';

export function verifyOTP() {
  return async (req: Request, res: Response, next: NextFunction) => {
    await connectRedis();

    const { email, otp } = res.locals.validatedBody;

    const otpKey = `otpPayload:${email}`;
    const otpPayload = await redisClient.hGetAll(otpKey);

    if (otpPayload.email !== email || otpPayload.otp !== otp) {
      res.status(401).json({ message: 'OTP authentication failed' });
      return;
    }

    await redisClient.del(otpKey);

    next();
  };
}

export default verifyOTP;
