import { redisClient, connectRedis } from '../../lib/connectRedis';

export async function createOTP(email: string) {
  await connectRedis();
  const otpValue = '111111';

  await redisClient.hSet(`otpPayload:${email}`, {
    email: email,
    otpValue: otpValue,
  });

  const otpPayload = await redisClient.hGetAll(`otpPayload:${email}`);

  return otpPayload;
}
