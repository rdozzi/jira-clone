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

export const userUpdateSchema = userCreateSchema.partial().strict();
