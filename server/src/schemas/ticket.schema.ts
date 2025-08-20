import { z } from 'zod';
import {
  isoDateStringSchema,
  numberIdSchema,
  ticketTitleSchema,
  ticketDescriptionSchema,
  ticketStatusSchema,
  ticketPrioritySchema,
  ticketTypeSchema,
} from './base.schema';

export const ticketCreateSchema = z
  .object({
    title: ticketTitleSchema,
    description: ticketDescriptionSchema,
    status: ticketStatusSchema,
    priority: ticketPrioritySchema,
    type: ticketTypeSchema,
    assigneeId: numberIdSchema,
    reporterId: numberIdSchema,
    boardId: numberIdSchema,
    dueDate: isoDateStringSchema,
  })
  .strict();

export const ticketUpdateSchema = ticketCreateSchema.partial().strict();

export const ticketCreateSchemaSuperUser = z
  .object({
    title: ticketTitleSchema,
    description: ticketDescriptionSchema,
    status: ticketStatusSchema,
    priority: ticketPrioritySchema,
    type: ticketTypeSchema,
    assigneeId: numberIdSchema,
    reporterId: numberIdSchema,
    boardId: numberIdSchema,
    dueDate: isoDateStringSchema,
    organizationId: numberIdSchema.optional(),
  })
  .strict();

export const ticketUpdateSchemaSuperUser = ticketCreateSchema
  .partial()
  .strict();
