import { Request, Response, NextFunction } from 'express';
import { redisClient, connectRedis } from '../../lib/connectRedis';
import { deleteKeysService } from '../../services/setupServices/deleteKeysService';

// From otpController, the key "otpPayload:${email}" is loaded as otpKey and then the payload is loaded into otpPayload. This payload is compared to the email and otp entered from the form in the front end. The user has five minutes to complete the task.

export function verifyOTP() {
  return async (req: Request, res: Response, next: NextFunction) => {
    await connectRedis();

    const { email, otp } = res.locals.validatedBody;

    const otpKey = `otpPayload:${email}`;
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
