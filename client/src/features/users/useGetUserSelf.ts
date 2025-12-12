import { useQuery } from '@tanstack/react-query';
import { getUserSelf as apiGetUserSelf } from '../../services/apiUsers';

export function useGetUserSelf() {
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
  });

  return { isLoadingUser, userSelf, error, refreshUser };
}
