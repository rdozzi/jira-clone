import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSingleAttachment as apiDeleteSingleAttachment } from '../../services/apiAttachments';
import { EntityType } from '../../types/Attachments';

export function useDeleteAttachment(entityType: EntityType, entityId: number) {
  const queryClient = useQueryClient();
  const { mutate: deleteSingleAttachment, status } = useMutation({
    mutationFn: (attachmentId: number) =>
      apiDeleteSingleAttachment(attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['attachment', entityType, entityId],
      });
    },
  });

  const isDeletingAttachment = status === 'pending';

  return { deleteSingleAttachment, isDeletingAttachment };
}
