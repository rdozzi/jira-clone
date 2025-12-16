import { useQuery } from '@tanstack/react-query';
import { getBoardById as apiGetBoardById } from '../../services/apiBoards';
import { useUser } from '../../contexts/useUser';
import { useAuth } from '../../contexts/useAuth';

export function useGetBoardById(boardId: number | undefined) {
  const { isAuthenticated } = useAuth();
  const { orgId } = useUser();
  const {
    isLoading: isFetchingBoard,
    data: board,
    error,
  } = useQuery({
    queryKey: ['board', boardId, orgId],
    queryFn: () => apiGetBoardById(boardId!),
    staleTime: 0,
    enabled: !!boardId && !!orgId && isAuthenticated,
  });

  return { isFetchingBoard, board, error };
}
