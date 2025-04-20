import { Request, Response, NextFunction } from 'express';

export function downloadMultipleAttachmentMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  next();
}

// No checks needed yet.
