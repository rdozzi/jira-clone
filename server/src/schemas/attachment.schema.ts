import { z } from 'zod';
import { attachmentEntityTypeSchema, numberIdSchema } from './base.schema';

export const uploadAttachmentSchema = z
  .object({
    entityType: attachmentEntityTypeSchema,
    entityId: numberIdSchema,
  })
  .strict();
