import { Response, NextFunction, RequestHandler } from 'express';
import { CustomRequest } from '../../types/CustomRequest';

// Top level function to store user and project information relevant to auth middleware in to res.locals variables
function storeUserAndProjectInfoFn(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void {
  const userId = req.user?.id;
  const userGlobalRole = req.user?.globalRole;
  const userProjects = req.userProjects;

  res.locals.userInfo = {
    id: userId,
    globalRole: userGlobalRole,
  };

  res.locals.userProjects = userProjects;

  next();
}

export const storeUserAndProjectInfo =
  storeUserAndProjectInfoFn as unknown as RequestHandler;
