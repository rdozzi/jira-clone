import { useQuery } from '@tanstack/react-query';
import { getBoardById as apiGetBoardById } from '../../services/apiBoards';
import { useUser } from '../../contexts/useUser';

export function useGetBoardById(boardId: number | undefined) {
  const { orgId } = useUser();
  const {
    isLoading: isFetchingBoard,
    data: board,
    error,
  } = useQuery({
    queryKey: ['board', boardId, orgId],
    queryFn: () => apiGetBoardById(boardId!),
    staleTime: 0,
    enabled: !!boardId && !!orgId, // Only run the query if boardId is truthy
  });

  return { isFetchingBoard, board, error };
}
