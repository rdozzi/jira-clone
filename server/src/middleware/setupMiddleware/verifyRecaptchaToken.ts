import { Request, Response, NextFunction } from 'express';

export function verifyRecaptchaToken() {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Stubbed function with mock data to integrate upon future completion of front end registration feature
    const mockRecaptchaResults = { success: true, 'error-codes': [] };

    if (
      (mockRecaptchaResults['success'],
      mockRecaptchaResults['error-codes'].length === 0)
    ) {
      next();
    }

    res.status(400).json({ message: 'reCaptcha test failed' });
    return;
  };
}
