import { Request, Response, NextFunction } from 'express';
import { numberIdSchema } from '../../schemas/base.schema';
import { z, ZodError } from 'zod';

export function validateMultipleParams(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const entityKeys = Object.keys(req.params);
  const results: { [key: string]: number } = {};

  for (const entityKey of entityKeys) {
    const result = numberIdSchema.safeParse(req.params[entityKey]);

    if (!result.success) {
      const error: ZodError = result!.error;
      const prettifiedError = z.prettifyError(error);
      res.status(400).json({
        error: 'Validation failed',
        message: prettifiedError,
      });
      return;
    }

    results[entityKey] = result.data;
  }

  res.locals.validatedParams = results;
  next();
}
