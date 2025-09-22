import { useQuery } from '@tanstack/react-query';
import { getBoardsByProjectId } from '../../services/apiBoards';

export function useGetBoardsByProjectId(projectId: number | null) {
  const {
    isLoading,
    data: boards,
    error,
  } = useQuery({
    queryKey: ['boards', projectId],
    queryFn: () => getBoardsByProjectId(projectId as number),
    enabled: projectId !== null,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return { isLoading, boards, error };
}
