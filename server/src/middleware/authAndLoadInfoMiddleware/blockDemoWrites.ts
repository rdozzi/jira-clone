import { Request, Response, NextFunction } from 'express';

export function blockDemoWrites(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userEmail = res.locals.userInfo.email;

  const isDemoUser = userEmail === process.env.DEMO_USER_EMAIL;

  const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (isDemoUser && writeMethods.includes(req.method)) {
    return res
      .status(403)
      .json({ message: 'Demo accounts cannot modify data.' });
  }

  next();
}
