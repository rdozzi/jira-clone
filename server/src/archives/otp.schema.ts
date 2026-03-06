import { z } from 'zod';
import { emailSchema } from '../schemas/base.schema';

export const createOTPHashSchema = z
  .object({
    email: emailSchema,
  })
  .strict();
