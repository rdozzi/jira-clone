import { Request, Response, NextFunction } from 'express';
import { redisClient, connectRedis } from '../../lib/connectRedis';

// Users will only be able to attempt 5 attempts to use this route per day.
export function attemptCountLimiter() {
  return async (req: Request, res: Response, next: NextFunction) => {
    await connectRedis();

    const timeInSeconds = 60 * 60 * 24; // 1 day
    const { email } = res.locals.validatedBody;

    const attemptKey = `attemptPayload:${email}`;
    const blockedEmailKey = `blockedEmail:${email}`;
    await redisClient.expire(attemptKey, timeInSeconds, 'NX');
    await redisClient.incr(attemptKey);

    if (Number(await redisClient.get(attemptKey)) >= 5) {
      await redisClient.set(blockedEmailKey, 'blocked', { EX: timeInSeconds });
      res.status(429).json({
        message:
          'Too many attempts with this email address. Try again in 24 hours',
      });
      return;
    }

    next();
  };
}
