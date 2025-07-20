import { z } from 'zod';
import { labelNameSchema, labelColorSchema } from './base.schema';

export const labelCreateSchema = z.object({
  name: labelNameSchema,
  color: labelColorSchema,
});

export const labelUpdateSchema = z
  .object({
    name: labelNameSchema,
    color: labelColorSchema,
  })
  .partial();
