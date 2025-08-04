import { redisClient, connectRedis } from '../../lib/connectRedis';

export async function deleteKeysService(email: string) {
  await connectRedis();

  const otpKey = `otpPayload:${email}`;
  const blockedEmail = `blockedEmail:${email}`;
  const attemptKey = `attemptPayload:${email}`;

  await redisClient.del(otpKey);
  await redisClient.del(blockedEmail);
  await redisClient.del(attemptKey);
}
