import { OrganizationRole } from './OrganizationRole';

export type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  organizationRole: OrganizationRole | null;
  userId?: number | null;
};
