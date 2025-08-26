import { Request, Response, NextFunction } from 'express';
import { createActivityLog } from '../services/logService';

// Middleware post log activity
// This middleware will log the activity after the response is sent
export function globalLogMiddleware() {
  return function (req: Request, res: Response, next: NextFunction) {
    res.on('finish', async () => {
      const logEvent = res.locals.logEvent;
      const logEvents = res.locals.logEvents;
      if (res.statusCode < 400) {
        try {
          if (logEvents && Array.isArray(logEvents)) {
            await Promise.all(
              logEvents.map((logEvent) => createActivityLog(logEvent))
            );
          } else if (logEvent) {
            await createActivityLog(logEvent);
          }
        } catch (error) {
          console.error('Error creating activity log(s): ', error);
        }
      }
    });

    next();
  };
}
