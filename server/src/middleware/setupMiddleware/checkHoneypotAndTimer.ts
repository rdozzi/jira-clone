import { Request, Response, NextFunction } from 'express';

export function checkHoneypotAndTimer() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { contactFax, secondaryEmail, duration } = req.body;

    // contactFax and secondaryEmail will be undefined by human users
    if (contactFax || secondaryEmail) {
      res.status(400).json({
        message: 'Honeypot fields are defined. Bot detected.',
      });
      return;
    }

    if (duration < 3000) {
      res.status(400).json({
        message: 'Form submission was too fast. Possible bot.',
      });
      return;
    }

    next();
  };
}
