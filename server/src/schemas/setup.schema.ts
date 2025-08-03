import { z } from 'zod';
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  organizationNameSchema,
  otpSchema,
} from './base.schema';

export const seedOrganizationSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  password: passwordSchema,
  organizationName: organizationNameSchema,
  otp: otpSchema,
});

export const seedSuperUserSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  password: passwordSchema,
});
