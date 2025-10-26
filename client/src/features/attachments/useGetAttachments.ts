import { EntityType } from '../../types/Attachments';
import { useQuery } from '@tanstack/react-query';
import { getAttachments as apiGetAttachments } from '../../services/apiAttachments';

export function useGetAttachments(entityType: EntityType, entityId: number) {
  const {
    isLoading: isFetchingAttachments,
    data: attachments,
    error: attachmentError,
  } = useQuery({
    queryKey: ['attachment', entityType, entityId],
    queryFn: () => apiGetAttachments(entityType, entityId),
    staleTime: 0,
    enabled: !!entityId && !!entityType,
  });

  return { isFetchingAttachments, attachments, attachmentError };
}
