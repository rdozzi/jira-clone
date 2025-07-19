import { z } from 'zod';

export const emailSchema = z
  .email('A valid email is required')
  .trim()
  .min(5, 'Email must be 5 charcters long')
  .max(255, 'Email must be less than 255 characters');

export const passwordSchema = z
  .string('A password is required')
  .trim()
  .min(8, 'Password should be at least 8 characters')
  .max(128, 'Password should be at most 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(
    /[^A-Za-z0-9]/,
    'Password must contain at least one special character'
  );
