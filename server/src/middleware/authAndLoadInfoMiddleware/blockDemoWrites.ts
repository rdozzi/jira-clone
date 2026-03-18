import { Request, Response, NextFunction } from 'express';

export function blockDemoWrites(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const isDemoUser = res.locals.userInfo.isDemoUser;

  const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (isDemoUser && writeMethods.includes(req.method)) {
    return res
      .status(403)
      .json({ message: 'Demo accounts cannot modify data.' });
  }

  next();
}
