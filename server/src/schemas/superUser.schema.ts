import { z } from 'zod';
import { emailSchema, nameSchema, passwordSchema } from './base.schema';

// Demotion of globalRole will be integrated into another version
export const updateSuperUserSchema = z
  .object({
    email: emailSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    password: passwordSchema,
  })
  .partial()
  .strict();
