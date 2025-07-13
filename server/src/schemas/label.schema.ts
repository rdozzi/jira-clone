import { z } from 'zod';

const nameSchema = z
  .string('Name is required')
  .trim()
  .min(1, 'Name cannot be empty')
  .max(25, 'Name must be less than 25 characters')
  .pipe(
    z.transform((str) =>
      str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
      )
    )
  );

const colorSchema = z
  .string()
  .regex(
    /^#[0-9A-F]{6}$/,
    'Color must be a valid 6-digit hex code (e.g., #AABBCC).'
  )
  .trim()
  .toUpperCase();

export const labelCreateSchema = z.object({
  name: nameSchema,
  color: colorSchema,
});

export const labelUpdateSchema = z.object({
  name: nameSchema.optional(),
  color: colorSchema.optional(),
});
