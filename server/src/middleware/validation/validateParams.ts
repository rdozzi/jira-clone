import { Request, Response, NextFunction } from 'express';
import { numberIdSchema } from '../../schemas/numberId.schema';
import { z, ZodError } from 'zod';

export function validateParams(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const entitykey = Object.keys(req.params)[0];

  const result = numberIdSchema.safeParse(req.params[entitykey]);

  if (!result!.success) {
    const error: ZodError = result!.error;
    const prettifiedError = z.prettifyError(error);
    res.status(400).json({
      error: 'Validation failed',
      message: prettifiedError,
    });
    return;
  }

  res.locals.validatedParam = result!.data;
  next();
}
