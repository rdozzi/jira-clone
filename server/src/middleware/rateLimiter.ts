import rateLimit from 'express-rate-limit';

const isProd = process.env.NODE_ENV === 'production';

const GLOBAL_LIMIT = isProd ? 1000 : 10000;
const ROUTE_LIMIT = isProd ? 300 : 10000;

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: GLOBAL_LIMIT,
  message: {
    error: 'Too many login attempts from this IP address. Try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const routeRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  limit: ROUTE_LIMIT,
  message: {
    error:
      'Too many creation attempts from this IP address. Try again in one hour.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
