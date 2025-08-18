import { redisClient, connectRedis } from '../../lib/connectRedis';
import { DAILY_ORG_LIMITS } from './limits';
import { ResourceType } from '../../types/ResourceAndColumnTypes';

//Key format: org:${organizationId}:<resource>:daily

export async function increaseCount(
  resourceType: ResourceType,
  organizationId: number,
  increment: number
) {
  await connectRedis();

  const EXPIRE_TIME = 60 * 60 * 24;
  const DAILY_LIMIT = DAILY_ORG_LIMITS[resourceType];
  if (!DAILY_LIMIT) {
    // No daily limit defined for this resource, skip Redis tracking
    return;
  }
  const key = `org:${organizationId}:${resourceType}:daily`;

  if (typeof DAILY_LIMIT !== 'number') {
    throw new Error(
      `Daily limit not defined for resource type: ${resourceType}`
    );
  }

  const luaScript = `
  local current = redis.call('GET',KEYS[1])
  local curr = tonumber(current) or 0
  local limit = tonumber(ARGV[1])
  local inc = tonumber(ARGV[2])
  local ttl = tonumber(ARGV[3])

  if not current then
    redis.call('SET', KEYS[1], inc)
    redis.call('EXPIRE',KEYS[1],ttl)
    return inc

  elseif current + inc >= limit then
    return -1
  
  else
    return redis.call('INCRBY',KEYS[1],inc)
  end`;

  const result = await redisClient.eval(luaScript, {
    keys: [key],
    arguments: [String(DAILY_LIMIT), String(increment), String(EXPIRE_TIME)],
  });

  if (result === -1) {
    throw new Error(
      `Daily limit of ${DAILY_LIMIT} has been reached for ${resourceType}`
    );
  }

  return key;
}

// export async function reduceCount(
//   resourceType: ResourceType,
//   organizationId: number,
//   decrement: number
// ) {
//   await connectRedis();

//   const key = `org:${organizationId}:${resourceType}:daily`;

//   const luaScript = `
//   local current = redis.call('GET',KEYS[1])
//   local curr = tonumber(current)
//   local dec = tonumber(ARGV[1])

//   if current - dec <= 0 then
//     return -1
//   end

//   local newCount = redis.call('DECRBY', KEYS[1], ARGV[1])
//   return newCount`;

//   const result = await redisClient.eval(luaScript, {
//     keys: [key],
//     arguments: [String(decrement)],
//   });

//   if (result === -1) {
//     throw new Error(`Cannot decrement below zero for ${resourceType}`);
//   }

//   return;
// }
