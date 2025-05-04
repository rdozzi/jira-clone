import { UserRole } from './UserRole';

export type StoredAuth = {
  token: string | null;
  userId: number | null;
  userRole: UserRole | null;
  expiresAt: string | null;
};
