import { useState } from 'react';
import { AuthContext } from './AuthContext';
import { UserRole } from '../types/UserRole';

export function AuthProviderContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const loginAs = (role: UserRole) => {
    setUserRole(role);
    console.log(`Logged in as ${role}`);
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
