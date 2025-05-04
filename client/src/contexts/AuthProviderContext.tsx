import { useState } from 'react';
import { AuthContext } from './AuthContext';

type UserRole = 'GUEST' | 'USER' | 'ADMIN' | null;

export function AuthProviderContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const loginAs = (role: UserRole) => {
    setUserRole(role);
  };
  const logout = () => {
    setUserRole(null);
  };
  return (
    <AuthContext.Provider value={{ userRole, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProviderContext;
