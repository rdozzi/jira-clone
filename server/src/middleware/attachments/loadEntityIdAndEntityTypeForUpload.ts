import { Request, Response, NextFunction } from 'express';

export function loadEntityIdAndEntityTypeForUpload(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Store res.locals.entityId from req.body
  res.locals.entityId = req.body.entityId;
  res.locals.entityType = req.body.entityType;

  next();
  return;
}
