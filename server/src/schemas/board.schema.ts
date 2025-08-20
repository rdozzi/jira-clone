import { z } from 'zod';
import {
  numberIdSchema,
  boardDescriptionSchema,
  boardNameSchema,
} from './base.schema';

export const boardCreateSchema = z
  .object({
    name: boardNameSchema,
    description: boardDescriptionSchema,
    projectId: numberIdSchema,
  })
  .strict();

export const boardUpdateSchema = boardCreateSchema.partial().strict();

export const boardCreateSchemaSuperUser = z
  .object({
    name: boardNameSchema,
    description: boardDescriptionSchema,
    projectId: numberIdSchema,
    organizationId: numberIdSchema.optional(),
  })
  .strict();

export const boardUpdateSchemaSuperUser = boardCreateSchema.partial().strict();
