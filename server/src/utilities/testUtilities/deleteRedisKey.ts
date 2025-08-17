import { redisClient, connectRedis } from '../../lib/connectRedis';
import { ResourceType } from '../../types/ResourceAndColumnTypes';

export async function deleteRedisKey(
  organizationId: number,
  resourceType: ResourceType
) {
  const key = `org:${organizationId}:${resourceType}:daily`;
  await connectRedis();

  const deletedKey = await redisClient.del(key);

  if (!deletedKey) {
    console.warn(`Error deleting key: ${key}. Check Logs.`);
  }

  return;
}
