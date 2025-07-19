import { Request, Response, NextFunction } from 'express';
import { authCredentialCheckSchema } from '../../schemas/auth.schema';
import { z, ZodError } from 'zod';

export function validateAuthBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = authCredentialCheckSchema.safeParse(req.body);

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
