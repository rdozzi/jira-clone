import { redisClient, connectRedis } from '../../lib/connectRedis';
import { DAILY_ORG_LIMITS } from './limits';

export async function checkDailyZeroCount(
  resourceType: keyof typeof DAILY_ORG_LIMITS,
  organizationId: number
) {
  const key = `org:${organizationId}:${resourceType}:daily`;
  await connectRedis();

  const resourceCount = await redisClient.get(key);

  if (!resourceCount) return false;

  const isDailyCountAboveZero = Number(resourceCount) > 0;

  return isDailyCountAboveZero;
}
