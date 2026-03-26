import { Request, Response, NextFunction } from 'express';

export function checkHoneypotForgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { contactFax, secondaryEmail } = req.body || {};

  // contactFax and secondaryEmail will be undefined by human users
  if (contactFax || secondaryEmail) {
    return res.status(400).json({
      message: 'Honeypot fields are defined. Bot detected.',
    });
  }

  return next();
}
