import { OrganizationRole } from './OrganizationRole';

export type StoredAuth = {
  token: string | null;
  userId: number | null;
  organizationRole: OrganizationRole | null;
};
