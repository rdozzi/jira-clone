// This should check for membership in a project and the user's role within that project.
import { Response, NextFunction, RequestHandler } from 'express';
import { CustomRequest } from '../types/CustomRequest';
import { ProjectRole } from '@prisma/client';
import { hasRequiredProjectRole } from '../lib/roles';

export function authorizeProjectRole(requiredRole: ProjectRole) {
  // Get project id from request parameters
}
