import { Response, NextFunction, RequestHandler } from 'express';
import { CustomRequest } from '../../types/CustomRequest';

// Top level function to store user and project information relevant to auth middleware in to res.locals variables
function storeUserAndProjectInfoFn(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void {
  const { id, globalRole, organizationId, organizationRole } = req.user!;
  const userProjects = req.userProjects;

  res.locals.userInfo = {
    id: id,
    globalRole: globalRole,
    organizationId: organizationId,
    organizationRole: organizationRole,
  };

  res.locals.userProjects = userProjects;

  next();
}

export const storeUserAndProjectInfo =
  storeUserAndProjectInfoFn as unknown as RequestHandler;
