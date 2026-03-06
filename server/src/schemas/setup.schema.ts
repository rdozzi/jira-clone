import { z } from 'zod';
import { emailSchema, nameSchema, organizationNameSchema } from './base.schema';

export const seedOrganizationSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  organizationName: organizationNameSchema,
});

// export const seedSuperUserSchema = z.object({
//   email: emailSchema,
//   firstName: nameSchema,
//   lastName: nameSchema,
//   password: passwordSchema,
// });
