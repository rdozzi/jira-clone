import { z } from 'zod';
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  organizationNameSchema,
} from './base.schema';

export const seedSuperAdminSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  password: passwordSchema,
  organizationName: organizationNameSchema,
});
