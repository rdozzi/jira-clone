import { z } from 'zod';
import {
  projectDescriptionSchema,
  projectNameSchema,
  numberIdSchema,
} from './base.schema';

export const projectCreateSchema = z
  .object({
    name: projectNameSchema,
    description: projectDescriptionSchema,
  })
  .strict();

export const projectUpdateSchema = projectCreateSchema.partial().strict();

export const projectCreateSchemaSuperUser = z
  .object({
    name: projectNameSchema,
    description: projectDescriptionSchema,
    organizationId: numberIdSchema.optional(),
  })
  .strict();

export const projectUpdateSchemaSuperUser = projectCreateSchema
  .partial()
  .strict();
