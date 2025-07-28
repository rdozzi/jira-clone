import { Request, Response, NextFunction } from 'express';

//Global role cannot be changed. SuperUsers can only change their own profiles.
export function checkSuperUserSelf() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.userInfo.id;
    const userIdParam = res.locals.validatedParam;

    if (userId !== userIdParam) {
      res.status(403).json({
        message: "Unauthorized. Cannot change another SuperUser's information",
      });
      return;
    }

    next();
  };
}
