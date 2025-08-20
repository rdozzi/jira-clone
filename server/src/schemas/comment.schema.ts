import { z } from 'zod';
import { numberIdSchema, commentContentSchema } from './base.schema';

export const commentCreateSchema = z
  .object({
    ticketId: numberIdSchema,
    content: commentContentSchema,
  })
  .strict();

export const commentUpdateSchema = commentCreateSchema.partial().strict();

export const commentCreateSchemaSuperUser = z
  .object({
    ticketId: numberIdSchema,
    content: commentContentSchema,
    organizationId: numberIdSchema.optional(),
  })
  .strict();

export const commentUpdateSchemaSuperUser = commentCreateSchema
  .partial()
  .strict();
