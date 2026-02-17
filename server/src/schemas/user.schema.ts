import { z } from 'zod';
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  organizationRoleSchema,
} from './base.schema';

export const userCreateSchema = z
  .object({
    email: emailSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    password: passwordSchema,
    organizationRole: organizationRoleSchema,
  })
  .strict();

export const userUpdateSchema = userCreateSchema
  .omit({ password: true })
  .partial()
  .strict();

export const userUpdatePasswordSchema = z
  .object({ newPassword: passwordSchema, confirmPassword: passwordSchema })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
  })
  .strict();
