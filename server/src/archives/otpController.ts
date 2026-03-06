import { Request, Response } from 'express';
import { redisClient, connectRedis } from '../lib/connectRedis';
import { generateOTP } from '../utilities/generateOTP';
import { sendOTPEmail } from '../services/otpServices/sendOTPEmail';

// Function creates an OTP with a key "otpPayload:${email}" that contains a payload with the user email and otpValue. This expires in 5 minutes from the time it's created.

export async function createOTPHash(req: Request, res: Response) {
  try {
    const EXPIRE_TIME = 60 * 5;

    const { email } = res.locals.validatedBody;
    const otpValue: string = generateOTP();
    await connectRedis();

    await redisClient.hSet(`otpPayload:${email}`, {
      email: email,
      otpValue: otpValue,
    });

    await redisClient.expire(`otpPayload:${email}`, EXPIRE_TIME);

    const clientPayload = await redisClient.hGetAll(`otpPayload:${email}`);

    const messageId = await sendOTPEmail(
      clientPayload.email,
      clientPayload.otpValue
    );

    res.status(200).json({
      message: 'OTP generation successful',
      data: {
        email: clientPayload.email,
        otpValue: clientPayload.otpValue,
        messageId: messageId,
      },
    });
  } catch (error) {
    console.error('Redis test failed:', error);
    res.status(500).json({ error: 'Redis test failed' });
  }
}
