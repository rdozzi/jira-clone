import { Request, Response, NextFunction, RequestHandler } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const isTest = process.env.NODE_ENV === 'test';
const isProd = process.env.NODE_ENV === 'production';

const GLOBAL_LIMIT = isProd ? 1000 : 10000;
const ROUTE_LIMIT = isProd ? 300 : 10000;
const AUTH_LIMIT = isProd ? 10 : 10000;

export const globalRateLimiter: RequestHandler = isTest
  ? (req: Request, res: Response, next: NextFunction) => {
      next();
    }
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: GLOBAL_LIMIT,
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      keyGenerator: (req) => {
        const ip = ipKeyGenerator(req.ip ?? 'unknown', 56) ?? 'unknown';
        const email = req.body?.email?.toLowerCase?.();

        return email ? `${ip}-${email}` : ip;
      },
      // message: Too many requests, please try again later.
      // statusCode: 429
    });

export const routeRateLimiter: RequestHandler = isTest
  ? (req: Request, res: Response, next: NextFunction) => {
      next();
    }
  : rateLimit({
      windowMs: 60 * 60 * 1000, // 60 minutes
      limit: ROUTE_LIMIT,
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      // message: Too many requests, please try again later.
      // statusCode: 429
    });

export const authRateLimiter: RequestHandler = isTest
  ? (req: Request, res: Response, next: NextFunction) => {
      next();
    }
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: AUTH_LIMIT,
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      keyGenerator: (req) => {
        const ip = ipKeyGenerator(req.ip ?? 'unknown', 56) ?? 'unknown';
        const email = req.body?.email?.toLowerCase?.();

        return email ? `${ip}-${email}` : ip;
      },
      // message: Too many requests, please try again later.
      // statusCode: 429
    });
