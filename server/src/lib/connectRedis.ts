import { createClient } from 'redis';

export const redisClient = createClient();

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}
