import { z } from 'zod';

export const numberParamSchema = z.coerce
  .number({
    error: 'Entity ID must be a valid number',
  })
  .int('Number must be an integer')
  .positive('Number must be positive');
