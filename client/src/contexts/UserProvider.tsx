import { UserContext } from './UserContext';
import { useGetUserSelf } from '../features/users/useGetUserSelf';

type UserProviderProps = { children: React.ReactNode };

export const UserProviderContext = ({ children }: UserProviderProps) => {
  const { userSelf, isLoadingUser, error, refreshUser } = useGetUserSelf();

  return (
    <UserContext.Provider
      value={{ userSelf, isLoadingUser, error, refreshUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
