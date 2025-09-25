import { UserContext } from './UserContext';
import { useGetUserSelf } from '../features/users/useGetUserSelf';

type UserProviderProps = { children: React.ReactNode };

export const UserProviderContext = ({ children }: UserProviderProps) => {
  const { user, isLoading, error, refreshUser } = useGetUserSelf();

  return (
    <UserContext.Provider value={{ user, isLoading, error, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
