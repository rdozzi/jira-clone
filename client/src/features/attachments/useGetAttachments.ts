import { EntityType } from '../../types/Attachments';
import { useQuery } from '@tanstack/react-query';
import { getAttachments as apiGetAttachments } from '../../services/apiAttachments';
import { useUser } from '../../contexts/useUser';

export function useGetAttachments(entityType: EntityType, entityId: number) {
  const { orgId } = useUser();
  const {
    isLoading: isFetchingAttachments,
    data: attachments,
    error: attachmentError,
  } = useQuery({
    queryKey: ['attachment', entityType, entityId, orgId],
    queryFn: () => apiGetAttachments(entityType, entityId),
    staleTime: 0,
    enabled: !!entityId && !!entityType && !!orgId,
  });

  return { isFetchingAttachments, attachments, attachmentError };
}
