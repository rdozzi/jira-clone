import { z } from 'zod';
import { emailSchema, reasonSchema } from './base.schema';

export const bannedEmailCreateSchema = z.object({
  email: emailSchema,
  reason: reasonSchema,
});
