import { Request, Response, NextFunction } from 'express';
import { tokenQuerySchema } from '../../schemas/base.schema';
import { ZodError, z } from 'zod';

export function validateTokenQuery(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { token } = req.query;

  const result = tokenQuerySchema.safeParse(token);

  if (!result.success) {
    const error: ZodError = result!.error;
    const prettifiedError = z.prettifyError(error);
    res.status(400).json({
      error: 'Validation failed',
      message: prettifiedError,
    });
    return;
  }

  res.locals.validatedQuery = result.data;

  next();
}
