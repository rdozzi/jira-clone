import { EntityType } from '../../types/Attachments';
import { useQuery } from '@tanstack/react-query';
import { getAllAttachments as apiGetAllAttachments } from '../../services/apiAttachments';

export function useGetBoardById(entityType: EntityType, entityId: number) {
  const {
    isLoading: isFetchingBoard,
    data: board,
    error,
  } = useQuery({
    queryKey: ['attachment', entityType, entityId],
    queryFn: () => apiGetAllAttachments(entityType, entityId),
    staleTime: 0,
    enabled: !!entityId,
  });

  return { isFetchingBoard, board, error };
}
