import { createContext } from 'react';
import { OrganizationRole } from '../types/OrganizationRole';
import { AuthState } from '../types/AuthState';

type AuthContextType = {
  authState: AuthState;
  login: (
    _token: string,
    _organizationRole: OrganizationRole,
    _userId: number,
    _expiresIn: number
  ) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
