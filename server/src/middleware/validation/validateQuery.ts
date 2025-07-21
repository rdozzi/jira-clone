import { Request, Response, NextFunction } from 'express';
import { emailQuerySchema, numberIdSchema } from '../../schemas/base.schema';
import { z, ZodError } from 'zod';

export function validateQuery(req: Request, res: Response, next: NextFunction) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const entityKeys = Object.keys(req.query);

  if (entityKeys.length === 0) {
    res.locals.validatedQuery = entityKeys;
    next();
    return;
  }

  const queryData: { [key: string]: unknown } = {};

  let result;

  for (const entityKey of entityKeys) {
    const queryProperty = req.query[entityKey];

    if (typeof queryProperty === 'string' && emailPattern.test(queryProperty)) {
      result = emailQuerySchema.safeParse(req.query[entityKey]);
    } else {
      result = numberIdSchema.safeParse(req.query[entityKey]);
    }

    if (!result.success) {
      const error: ZodError = result.error;
      const prettifiedError = z.prettifyError(error);
      res.status(400).json({
        error: 'Validation failed',
        message: prettifiedError,
      });
      return;
    }
    queryData[entityKey] = result.data;
  }

  res.locals.validatedQuery = queryData;
  next();
}
