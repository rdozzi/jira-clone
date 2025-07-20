import { z } from 'zod';
import { numberIdSchema, commentContentSchema } from './base.schema';

export const createCommentSchema = z
  .object({
    ticketId: numberIdSchema,
    content: commentContentSchema,
  })
  .strict();

export const updateUserSchema = createCommentSchema.partial().strict();
