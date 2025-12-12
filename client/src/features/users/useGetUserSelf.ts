import { useQuery } from '@tanstack/react-query';
import { getUserSelf as apiGetUserSelf } from '../../services/apiUsers';
import { useAuth } from '../../contexts/useAuth';

export function useGetUserSelf() {
  const { isAuthenticated } = useAuth();
  const {
    isLoading: isLoadingUser,
    data: userSelf,
    error,
    refetch: refreshUser,
  } = useQuery({
    queryKey: ['userSelf'],
    queryFn: apiGetUserSelf,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    enabled: isAuthenticated,
  });

  return { isLoadingUser, userSelf, error, refreshUser };
}
