import { Request, Response, NextFunction } from 'express';

function loadEntityIdAndEntityTypeForUpload(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.entityId = req.body.entityId;
  res.locals.entityType = req.body.entityType;

  next();
  return;
}

export default loadEntityIdAndEntityTypeForUpload;
