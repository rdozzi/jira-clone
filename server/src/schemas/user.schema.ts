import { z } from 'zod';
import { GlobalRole } from '@prisma/client';

export const emailSchema = z
  .email('A valid email is required')
  .trim()
  .min(5, 'Email must be 5 charcters long')
  .max(255, 'Email must be less than 255 characters');

export const nameSchema = z
  .string('A string is required')
  .trim()
  .min(3)
  .max(128)
  .refine((name) => /^[A-Za-z0-9 _'-]+$/.test(name), {
    message: 'Name contains invalid characters',
  })
  .refine((name) => !/\s{2,}/.test(name), {
    message: 'Name must not contain consecutive spaces',
  })
  .transform((name) =>
    name
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase())
      .join(' ')
  );

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

export const globalRoleSchema = z
  .string('A string is required')
  .trim()
  .toUpperCase()
  .refine((val) => Object.values(GlobalRole).includes(val as GlobalRole), {
    message: 'Invalid global role',
  });

export const createUserSchema = z
  .object({
    email: emailSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    password: passwordSchema,
    globalRole: globalRoleSchema,
  })
  .strict();

export const updateUserSchema = createUserSchema.partial().strict();
