import { redisClient, connectRedis } from '../../lib/connectRedis';
import { DAILY_ORG_LIMITS } from './limits';
import { ResourceType } from '../../types/ResourceType';

//Key format: org:${organizationId}:<resource>:daily

export async function increaseCount(
  resourceType: ResourceType,
  organizationId: number,
  fileSize?: number
) {
  await connectRedis();

  const isFile = resourceType === 'FileStorage';

  const increment =
    isFile && typeof fileSize === 'number' && fileSize > 0 ? fileSize : 1;

  const EXPIRE_TIME = 60 * 60 * 24;
  const DAILY_LIMIT = DAILY_ORG_LIMITS[resourceType];
  const key = `org:${organizationId}:${resourceType}:daily`;

  if (typeof DAILY_LIMIT !== 'number') {
    throw new Error(
      `Daily limit not defined for resource type: ${resourceType}`
    );
  }

  const luaScript = `local current = redis.call('GET',KEYS[1])
  if current and tonumber(current) >= tonumber(ARGV[1]) then
    return -1
  end
  local newCount = redis.call('INCRBY', KEYS[1], ARGV[2])
  if newCount == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[3], ARGV[4])
  end
  return newCount`;

  const result = await redisClient.eval(luaScript, {
    keys: [key],
    arguments: [
      String(DAILY_LIMIT),
      String(increment),
      String(EXPIRE_TIME),
      'NX',
    ],
  });

  if (result === -1) {
    throw new Error(
      `Daily limit of ${DAILY_LIMIT} has been reached for ${resourceType}`
    );
  }

  return;
}

export async function reduceCount(
  resourceType: ResourceType,
  organizationId: number,
  fileSize?: number
) {
  await connectRedis();

  const isFile = resourceType === 'FileStorage';

  const decrement =
    isFile && typeof fileSize === 'number' && fileSize > 0 ? fileSize : 1;

  const key = `org:${organizationId}:${resourceType}:daily`;

  const luaScript = `local current = redis.call('GET',KEYS[1])
  if current and tonumber(current) <= 0 then
    return -1
  end
  local newCount = redis.call('DECRBY', KEYS[1], ARGV[1])
  return newCount`;

  const result = await redisClient.eval(luaScript, {
    keys: [key],
    arguments: [String(decrement)],
  });

  if (result === -1) {
    throw new Error(`Cannot decrement below zero for ${resourceType}`);
  }

  return;
}
