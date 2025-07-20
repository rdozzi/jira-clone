import { z } from 'zod';

export const emailQuerySchema = z
  .string()
  .trim()
  .pipe(z.email('Input must be a valid email').min(5).max(128));
