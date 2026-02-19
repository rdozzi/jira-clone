import { createClient } from 'redis';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined');
}

export const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export async function verifyRedisConnection() {
  const key = 'redis_healthcheck';
  const value = Date.now().toString();

  await redisClient.set(key, value, { EX: 30 });
  const result = await redisClient.get(key);

  if (result !== value) {
    throw new Error('Redis health check failed');
  }

  console.log('Redis connected and verified');
}

export async function checkRedis() {
  const isTest = process.env.NODE_ENV === 'test';
  if (!isTest) {
    await connectRedis();
    await verifyRedisConnection();
  }
  return;
}
