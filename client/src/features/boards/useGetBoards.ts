import { useQuery } from '@tanstack/react-query';
import { getBoards } from '../../services/apiBoards';
import { useUser } from '../../contexts/useUser';

export function useGetBoards() {
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
    enabled: !!orgId,
  });

  return { isLoading, boards, error };
}
