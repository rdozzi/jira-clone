import { useQuery } from '@tanstack/react-query';
import { getBoardsByProjectId } from '../../services/apiBoards';
import { useUser } from '../../contexts/useUser';
import { useAuth } from '../../contexts/useAuth';

export function useGetBoardsByProjectId(projectId: number | null) {
  const { isAuthenticated } = useAuth();
  const { orgId } = useUser();
  const {
    isLoading,
    data: boards,
    error,
  } = useQuery({
    queryKey: ['boards', projectId, orgId],
    queryFn: () => getBoardsByProjectId(projectId as number),
    enabled: !!projectId && isAuthenticated,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return { isLoading, boards, error };
}
