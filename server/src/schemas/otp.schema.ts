import { z } from 'zod';
import { emailSchema } from './base.schema';

export const createOTPHashSchema = z
  .object({
    email: emailSchema,
  })
  .strict();
