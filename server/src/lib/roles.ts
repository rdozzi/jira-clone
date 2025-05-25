import { GlobalRole } from '@prisma/client';

export const roleHierarchy = Object.values(GlobalRole);

export type AppRole = (typeof roleHierarchy)[number];

export function hasRequiredGlobalRole(
  userRole: AppRole,
  requiredRole: AppRole
): boolean {
  const userIndex = roleHierarchy.indexOf(userRole);
  const requiredIndex = roleHierarchy.indexOf(requiredRole);

  return userIndex >= requiredIndex;
}
