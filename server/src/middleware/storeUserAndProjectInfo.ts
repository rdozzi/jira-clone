import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/CustomRequest';

export function storeUserAndProjectInfo(
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

  res.locals.userProjectDetails = userProjects;

  next();
}
