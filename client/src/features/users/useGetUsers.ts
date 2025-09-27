import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../services/apiUsers';

export function useGetUsers() {
  const {
    isLoading: isLoadingUsers,
    data: users,
    error,
  } = useQuery({ queryKey: ['users'], queryFn: getUsers });

  return { isLoadingUsers, users, error };
}
