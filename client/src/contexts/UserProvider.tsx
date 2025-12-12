import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import { useGetUserSelf } from '../features/users/useGetUserSelf';

type UserProviderProps = { children: React.ReactNode };

export const UserProvider = ({ children }: UserProviderProps) => {
  const [orgId, setOrgId] = useState<number | null>(null);
  const { userSelf, isLoadingUser, error, refreshUser } = useGetUserSelf();

  useEffect(() => {
    if (userSelf?.organizationId) {
      setOrgId(userSelf?.organizationId);
    }
  }, [userSelf?.organizationId]);

  return (
    <UserContext.Provider
      value={{ userSelf, orgId, isLoadingUser, error, refreshUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
