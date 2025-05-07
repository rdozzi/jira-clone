import { Role } from '@prisma/client';

export const roleHierarchy = Object.values(Role);

export type AppRole = (typeof roleHierarchy)[number];

export function hasRequiredRole(
  userRole: AppRole,
  requiredRole: AppRole
): boolean {
  const userIndex = roleHierarchy.indexOf(userRole);
  const requiredIndex = roleHierarchy.indexOf(requiredRole);

  return userIndex >= requiredIndex;
}
