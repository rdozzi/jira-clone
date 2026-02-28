import { Response, NextFunction, RequestHandler } from 'express';

export function blockSelfDelete() {
  return ((req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.userInfo.id;
    const paramId = res.locals.validatedParam;

    if (userId === paramId) {
      res
        .status(403)
        .json({ error: 'Unauthorized to delete yourself from organization.' });
      return;
    }

    next();
    return;
  }) as unknown as RequestHandler;
}
