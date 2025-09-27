import { createContext } from 'react';
// import { UseMutateFunction } from '@tanstack/react-query';
import { Users } from '../types/Users';
import { QueryObserverResult } from '@tanstack/react-query';

interface UserContextType {
  userSelf: Users | null;
  isLoadingUser: boolean;
  error: Error | null;
  refreshUser: () => Promise<QueryObserverResult<any, Error>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
