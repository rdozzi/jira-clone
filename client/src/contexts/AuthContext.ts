import { createContext, useContext } from 'react';
import { UserRole } from '../types/UserRole';

type AuthContextType = {
  userRole: UserRole;
  loginAs: (_role: UserRole) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
// This is a custom hook that provides the authentication context to components
// that need to access the authentication state and methods.
