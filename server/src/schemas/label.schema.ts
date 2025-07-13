import { z } from 'zod';

export const labelCreateSchema = z.object({
  name: z
    .string('Name is required')
    .min(1, 'Name cannot be empty')
    .max(25, 'Name must be less than 25 characters')
    .trim()
    .transform((str) =>
      str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
      )
    ),
  color: z
    .string()
    .regex(
      /^#[0-9A-F]{6}$/,
      'Color must be a valid 6-digit hex code (e.g., #AABBCC).'
    )
    .trim()
    .toUpperCase(),
});

export const updateLabelSchema = labelCreateSchema.partial();
