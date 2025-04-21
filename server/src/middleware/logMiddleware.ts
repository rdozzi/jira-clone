import { Request, Response, NextFunction } from 'express';
import { createActivityLog } from '../services/logService';

// Middleware post log activity
// This middleware will log the activity after the response is sent
export function globalLogMiddleware() {
  return function (req: Request, res: Response, next: NextFunction) {
    res.on('finish', async () => {
      const logEvent = res.locals.logEvent;
      if (res.statusCode < 400 && logEvent) {
        try {
          await createActivityLog(logEvent);
        } catch (error) {
          console.error('Error creating activity log: ', error);
        }
      }
    });

    next();
  };
}
