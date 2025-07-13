import { Request, Response, NextFunction } from 'express';
import { labelUpdateSchema } from '../../schemas/label.schema';
import { z, ZodError } from 'zod';

export function validateUpdateLabel(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = labelUpdateSchema.safeParse(req.body);

  if (!result.success) {
    const error: ZodError = result.error;
    const prettifiedError = z.prettifyError(error);
    res.status(400).json({
      error: 'Validation failed',
      message: prettifiedError,
    });
    return;
  }

  res.locals.validatedBody = result.data;
  next();
}
