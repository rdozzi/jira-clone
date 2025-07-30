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
    organizationId: numberIdSchema.optional(),
  })
  .strict();

export const projectUpdateSchema = projectCreateSchema.partial().strict();
