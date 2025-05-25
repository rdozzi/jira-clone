import { GlobalRole, ProjectRole } from '@prisma/client';

export const globalRoleHierarchy = Object.values(GlobalRole);
export const projectRoleHierarchy = Object.values(ProjectRole);

export type GlobalAppRole = (typeof globalRoleHierarchy)[number];
export type ProjectAppRole = (typeof projectRoleHierarchy)[number];

export function hasRequiredGlobalRole(
  userRole: GlobalAppRole,
  requiredRole: GlobalAppRole
): boolean {
  const userIndex = globalRoleHierarchy.indexOf(userRole);
  const requiredIndex = globalRoleHierarchy.indexOf(requiredRole);

  return userIndex >= requiredIndex;
}

export function hasRequiredProjectRole(
  userRole: ProjectAppRole,
  requiredRole: ProjectAppRole
): boolean {
  const userIndex = projectRoleHierarchy.indexOf(userRole);
  const requiredIndex = projectRoleHierarchy.indexOf(requiredRole);

  return userIndex >= requiredIndex;
}
