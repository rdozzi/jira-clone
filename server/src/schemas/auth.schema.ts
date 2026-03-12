import { z } from 'zod';
import {
  emailAuthSchema,
  passwordAuthSchema,
  passwordSchema,
} from './base.schema';

export const authCredentialCheckSchema = z.object({
  email: emailAuthSchema,
  password: passwordAuthSchema,
});

export const changePasswordPublicSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
  })
  .strict();
