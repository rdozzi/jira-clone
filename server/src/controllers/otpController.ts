import { Request, Response } from 'express';
import { redisClient, connectRedis } from '../lib/connectRedis';
import { generateOTP } from '../utilities/generateOTP';
import { sendOTPEmail } from '../services/otpServices/sendOTPEmail';

export async function createOTPHash(req: Request, res: Response) {
  try {
    const EXPIRE_TIME = 60 * 5;

    // const email = res.locals.validatedBody;
    const email: string = `test@email.com`;
    const otpValue: string = generateOTP();
    await connectRedis();

    await redisClient.hSet(`otpPayload:${email}`, {
      email: email,
      otpValue: otpValue,
    });

    await redisClient.expire(`otpPayload:${email}`, EXPIRE_TIME);

    const clientPayload = await redisClient.hGetAll(`otpPayload:${email}`);

    sendOTPEmail(clientPayload.email, clientPayload.otpValue);

    res
      .status(200)
      .json({ message: 'Function Successful', data: clientPayload });
  } catch (error) {
    console.error('Redis test failed:', error);
    res.status(500).json({ error: 'Redis test failed' });
  }
}
