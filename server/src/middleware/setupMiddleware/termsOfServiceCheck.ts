import { Request, Response, NextFunction } from 'express';

export function termsOfServiceCheck(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const termsOfServiceChecked = req.body.acceptTerms;

  if (!termsOfServiceChecked) {
    return res
      .status(400)
      .json({ message: 'User must agree to the terms of service.' });
  }

  next();
}
