import { OrganizationRole } from './OrganizationRole';
import { GlobalRole } from './GlobalRole';

export interface Users {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  organizationRole: OrganizationRole;
  globalRole: GlobalRole;
  avatarSource: string;
  isBanned: boolean;
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isDeleted: boolean;
}
