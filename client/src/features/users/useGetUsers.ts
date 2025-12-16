import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../services/apiUsers';
import { useUser } from '../../contexts/useUser';
import { useAuth } from '../../contexts/useAuth';

export function useGetUsers() {
  const { isAuthenticated } = useAuth();
  const { orgId } = useUser();
  const {
    isLoading: isLoadingUsers,
    data: users,
    error,
  } = useQuery({
    queryKey: ['users', orgId],
    queryFn: getUsers,
    staleTime: 0,
    enabled: !!orgId && isAuthenticated,
  });

  return { isLoadingUsers, users, error };
}
