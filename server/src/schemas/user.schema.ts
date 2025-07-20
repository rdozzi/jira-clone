import { z } from 'zod';
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  globalRoleSchema,
} from './base.schema';

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
