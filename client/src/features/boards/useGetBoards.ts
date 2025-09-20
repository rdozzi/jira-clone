import { useQuery } from '@tanstack/react-query';
import { getBoards } from '../../services/apiBoards';

export function useGetBoards() {
  const {
    isLoading,
    data: boards,
    error,
  } = useQuery({
    queryKey: ['boards'],
    queryFn: getBoards,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return { isLoading, boards, error };
}
