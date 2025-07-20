import { z } from 'zod';
import { emailAuthSchema, passwordAuthSchema } from './base.schema';

export const authCredentialCheckSchema = z.object({
  email: emailAuthSchema,
  password: passwordAuthSchema,
});
