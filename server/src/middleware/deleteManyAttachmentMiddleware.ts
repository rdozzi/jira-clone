import { Request, Response, NextFunction } from 'express';

export function deleteManyAttachmentMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  next();
}

// No checks needed yet.
