import { Request, Response, NextFunction } from 'express';
import { emailQuerySchema, numberIdSchema } from '../../schemas/base.schema';
import { z, ZodError } from 'zod';

export function validateQuery(req: Request, res: Response, next: NextFunction) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const entitykey = Object.keys(req.query)[0];

  let result;

  const queryProperty = req.query[entitykey];

  if (typeof queryProperty === 'string' && emailPattern.test(queryProperty)) {
    result = emailQuerySchema.safeParse(req.query[entitykey]);
  } else {
    result = numberIdSchema.safeParse(req.query[entitykey]);
  }

  if (!result!.success) {
    const error: ZodError = result!.error;
    const prettifiedError = z.prettifyError(error);
    res.status(400).json({
      error: 'Validation failed',
      message: prettifiedError,
    });
    return;
  }

  res.locals.validatedQuery = { query: entitykey, data: result!.data };
  next();
}
