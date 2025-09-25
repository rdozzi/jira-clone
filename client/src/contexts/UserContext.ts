import { createContext } from 'react';
// import { UseMutateFunction } from '@tanstack/react-query';
import { Users } from '../types/Users';
import { QueryObserverResult } from '@tanstack/react-query';

interface UserContextType {
  user: Users | null;
  isLoading: boolean;
  error: Error | null;
  refreshUser: () => Promise<QueryObserverResult<any, Error>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
