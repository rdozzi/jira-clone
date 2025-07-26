import { ProjectRole, OrganizationRole } from '@prisma/client';

export const organizationRoleHierarchy = Object.values(OrganizationRole);
export const projectRoleHierarchy = Object.values(ProjectRole);

export type OrganizationAppRole = (typeof organizationRoleHierarchy)[number];
export type ProjectAppRole = (typeof projectRoleHierarchy)[number];

export function hasRequiredOrganizationRole(
  userRole: OrganizationAppRole,
  requiredRole: OrganizationAppRole
): boolean {
  const userIndex = organizationRoleHierarchy.indexOf(userRole);
  const requiredIndex = organizationRoleHierarchy.indexOf(requiredRole);

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
