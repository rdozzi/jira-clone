import { z } from 'zod';
import {
  GlobalRole,
  ProjectRole,
  AttachmentEntityType,
  Status,
  Priority,
  Type,
} from '@prisma/client';
import LeoProfanity from 'leo-profanity';

const filter = LeoProfanity;
const badWordsList = filter.list();

export const attachmentEntityTypeSchema = z
  .string('A string is required')
  .trim()
  .toUpperCase()
  .refine(
    (val) =>
      Object.values(AttachmentEntityType).includes(val as AttachmentEntityType),
    {
      message: 'Invalid entity type',
    }
  );

export const boardDescriptionSchema = z
  .string()
  .trim()
  .max(500, 'Board description cannot exceed 500 characters')
  .optional();

export const boardNameSchema = z
  .string('A string is required')
  .trim()
  .min(3, 'Board name must be at least 3 characters')
  .max(100, 'Board name cannot exceed 100 characters');

export const commentContentSchema = z
  .string('Comment content is rquired')
  .trim()
  .min(1, 'Comment cannot be empty')
  .max(500, 'Comment cannot exceed 500 characters including spaces')
  .transform((val) => val.replace(/\s+/g, ' ').trim())
  .refine(
    (val) => {
      const tokens = val.toLowerCase().split(/\s+/);
      return !tokens.some((token) =>
        badWordsList.some((word) => token === word.toLowerCase())
      );
    },
    { error: 'Comment contains prohibited language.' }
  );

export const emailAuthSchema = z
  .email('Invalid credentials')
  .min(5, 'Invalid Credentials')
  .max(255, 'Invalid Credentials');

export const emailQuerySchema = z
  .string()
  .trim()
  .pipe(z.email('Input must be a valid email').min(5).max(128));

export const emailSchema = z
  .email('A valid email is required')
  .trim()
  .min(5, 'Email must be 5 charcters long')
  .max(255, 'Email must be less than 255 characters');

export const globalRoleSchema = z
  .string('A string is required')
  .trim()
  .toUpperCase()
  .refine((val) => Object.values(GlobalRole).includes(val as GlobalRole), {
    message: 'Invalid global role',
  });

export const isoDateStringSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  });

export const labelColorSchema = z
  .string()
  .regex(
    /^#[0-9A-F]{6}$/,
    'Color must be a valid 6-digit hex code (e.g., #AABBCC).'
  )
  .trim()
  .toUpperCase();

export const labelNameSchema = z
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

export const nameSchema = z
  .string('A string is required')
  .trim()
  .min(3)
  .max(128)
  .refine((name) => /^[A-Za-z0-9 _'-]+$/.test(name), {
    message: 'Name contains invalid characters',
  })
  .refine((name) => !/\s{2,}/.test(name), {
    message: 'Name must not contain consecutive spaces',
  })
  .transform((name) =>
    name
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase())
      .join(' ')
  );

export const numberIdSchema = z.coerce
  .number({
    error: 'Entity ID must be a valid number',
  })
  .int('Number must be an integer')
  .positive('Number must be positive');

export const passwordAuthSchema = z
  .string('Invalid credentials')
  .min(1, 'Invalid credentials')
  .max(128, 'Invalid credentials');

export const passwordSchema = z
  .string('A password is required')
  .trim()
  .min(8, 'Password should be at least 8 characters')
  .max(128, 'Password should be at most 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(
    /[^A-Za-z0-9]/,
    'Password must contain at least one special character'
  );

export const projectRoleSchema = z
  .string('A string is required')
  .trim()
  .toUpperCase()
  .refine((val) => Object.values(ProjectRole).includes(val as ProjectRole), {
    message: 'Invalid project role',
  });

export const ticketStatusSchema = z
  .string('A string is required')
  .trim()
  .toUpperCase()
  .refine((val) => Object.values(Status).includes(val as Status), {
    message: 'Invalid project role',
  });

export const ticketDescriptionSchema = z
  .string('Ticket description is required')
  .trim()
  .min(10, 'Ticket description must be at least 10 characters')
  .max(3000, 'Ticket description cannot exceed 3000 characters')
  .transform((val) => val.replace(/\s+/g, ' ').trim())
  .refine(
    (val) => {
      const tokens = val.toLowerCase().split(/\s+/);
      return !tokens.some((token) =>
        badWordsList.some((word) => token === word.toLowerCase())
      );
    },
    { error: 'Comment contains prohibited language.' }
  );

export const ticketTitleSchema = z
  .string('Ticket title is required')
  .trim()
  .min(3, 'Ticket title must be at least 3 characters')
  .max(150, 'Ticket title cannot exceed 150 characters')
  .transform((val) => val.replace(/\s+/g, ' ').trim())
  .refine(
    (val) => {
      const tokens = val.toLowerCase().split(/\s+/);
      return !tokens.some((token) =>
        badWordsList.some((word) => token === word.toLowerCase())
      );
    },
    { error: 'Comment contains prohibited language.' }
  );

export const ticketPrioritySchema = z
  .string('A string is required')
  .trim()
  .toUpperCase()
  .refine((val) => Object.values(Priority).includes(val as Priority), {
    message: 'Invalid project role',
  });

export const ticketTypeSchema = z
  .string('A string is required')
  .trim()
  .toUpperCase()
  .refine((val) => Object.values(Type).includes(val as Type), {
    message: 'Invalid project role',
  });

export const reasonSchema = z
  .string('A reason is required')
  .trim()
  .min(1, 'Reason should be at least 10 characters')
  .max(255, 'Reason cannot exceed 255 characters')
  .transform((reason) => reason.charAt(0).toUpperCase() + reason.slice(1));
