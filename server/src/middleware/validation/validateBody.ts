import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError, z } from 'zod';

export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const error: ZodError = result!.error;
      const prettifiedError = z.prettifyError(error);
      res.status(400).json({
        error: 'Validation failed',
        message: prettifiedError,
      });
      return;
    }

    res.locals.validatedBody = result.data;
    next();
  };
}
