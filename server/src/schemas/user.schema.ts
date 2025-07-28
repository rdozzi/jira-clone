import { z } from 'zod';
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  organizationRoleSchema,
} from './base.schema';

export const createUserSchema = z
  .object({
    email: emailSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    password: passwordSchema,
    organizationRole: organizationRoleSchema,
  })
  .strict();

export const updateUserSchema = createUserSchema.partial().strict();
