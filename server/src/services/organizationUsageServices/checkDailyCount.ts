import { redisClient, connectRedis } from '../../lib/connectRedis';
import { DAILY_ORG_LIMITS } from './limits';

export async function checkDailyCount(
  resourceType: keyof typeof DAILY_ORG_LIMITS,
  organizationId: number
) {
  const DAILY_LIMIT = DAILY_ORG_LIMITS[resourceType];
  const key = `org:${organizationId}:${resourceType}:daily`;
  await connectRedis();

  if (!DAILY_LIMIT) return true; // return of undefined = no daily limit

  const resourceCount = await redisClient.get(key);

  const isBelowDailyCount = Number(resourceCount ?? 0) < DAILY_LIMIT;

  return isBelowDailyCount;
}
