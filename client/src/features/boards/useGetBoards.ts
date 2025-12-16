import { useQuery } from '@tanstack/react-query';
import { getBoards } from '../../services/apiBoards';
import { useUser } from '../../contexts/useUser';
import { useAuth } from '../../contexts/useAuth';

export function useGetBoards() {
  const { isAuthenticated } = useAuth();
  const { orgId } = useUser();
  const {
    isLoading,
    data: boards,
    error,
  } = useQuery({
    queryKey: ['boards', orgId],
    queryFn: getBoards,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    enabled: !!orgId && isAuthenticated,
  });

  return { isLoading, boards, error };
}
