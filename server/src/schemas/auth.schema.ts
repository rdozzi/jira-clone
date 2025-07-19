import { z } from 'zod';

const emailSchema = z
  .email('Invalid credentials')
  .min(5, 'Invalid Credentials')
  .max(255, 'Invalid Credentials');

const passwordSchema = z
  .string('Invalid credentials')
  .min(1, 'Invalid credentials')
  .max(128, 'Invalid credentials');

export const authCredentialCheckSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
