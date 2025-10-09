import { useQuery } from '@tanstack/react-query';
import { getBoardById as apiGetBoardById } from '../../services/apiBoards';

export function useGetBoardById(boardId: number | undefined) {
  const {
    isLoading: isFetchingBoard,
    data: board,
    error,
  } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => apiGetBoardById(boardId!),
    enabled: !!boardId, // Only run the query if boardId is truthy
  });

  return { isFetchingBoard, board, error };
}
