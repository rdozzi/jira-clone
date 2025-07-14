import { Request, Response, NextFunction } from 'express';

export function resolveProjectIdForUserRoutes() {
  return (req: Request, res: Response, next: NextFunction) => {
    const projectIdRaw = req.params.projectId || req.body.projectId;
    const projectId = parseInt(projectIdRaw, 10);
    if (isNaN(projectId)) {
      res.status(400).json({ message: 'Invalid project ID' });
      return;
    }

    res.locals.projectId = projectId;
    next();
    return;
  };
}
