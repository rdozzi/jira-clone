import { Request, Response, NextFunction } from 'express';
import { redisClient, connectRedis } from '../../lib/connectRedis';

export function isBlocked() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { email } = res.locals.validatedBody;
    await connectRedis();

    const blockedEmailKey = `blockedEmail:${email}`;

    const blockedEmail = await redisClient.get(blockedEmailKey);

    if (blockedEmail) {
      res
        .status(404)
        .json({ message: 'Too many attempts. Please try again later.' });
      return;
    }

    next();
  };
}
