import { UserRole } from './UserRole';

export type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userId?: number | null;
};
