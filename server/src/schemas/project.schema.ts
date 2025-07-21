import { z } from 'zod';
import { projectDescriptionSchema, projectNameSchema } from './base.schema';

export const projectCreateSchema = z
  .object({
    name: projectNameSchema,
    description: projectDescriptionSchema,
  })
  .strict();

export const projectUpdateSchema = projectCreateSchema.partial().strict();
