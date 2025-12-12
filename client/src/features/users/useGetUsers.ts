import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../services/apiUsers';
import { useUser } from '../../contexts/useUser';

export function useGetUsers() {
  const { orgId } = useUser();
  const {
    isLoading: isLoadingUsers,
    data: users,
    error,
  } = useQuery({
    queryKey: ['users', orgId],
    queryFn: getUsers,
    staleTime: 0,
    enabled: !!orgId,
  });

  return { isLoadingUsers, users, error };
}
