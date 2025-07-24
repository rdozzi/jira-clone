import { ProjectRole, OrganizationRole } from '@prisma/client';

export const globalRoleHierarchy = Object.values(OrganizationRole);
export const projectRoleHierarchy = Object.values(ProjectRole);

export type OrganizationAppRole = (typeof globalRoleHierarchy)[number];
export type ProjectAppRole = (typeof projectRoleHierarchy)[number];

export function hasRequiredGlobalRole(
  userRole: OrganizationAppRole,
  requiredRole: OrganizationAppRole
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
