import { z } from 'zod';
import { numberIdSchema, commentContentSchema } from './base.schema';

export const commentCreateSchema = z
  .object({
    ticketId: numberIdSchema,
    content: commentContentSchema,
    organizationId: numberIdSchema.optional(),
  })
  .strict();

export const commentUpdateSchema = commentCreateSchema.partial().strict();
