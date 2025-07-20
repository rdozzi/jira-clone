import { z } from 'zod';

const emailAuthSchema = z
  .email('Invalid credentials')
  .min(5, 'Invalid Credentials')
  .max(255, 'Invalid Credentials');

const passwordAuthSchema = z
  .string('Invalid credentials')
  .min(1, 'Invalid credentials')
  .max(128, 'Invalid credentials');

export const authCredentialCheckSchema = z.object({
  email: emailAuthSchema,
  password: passwordAuthSchema,
});
