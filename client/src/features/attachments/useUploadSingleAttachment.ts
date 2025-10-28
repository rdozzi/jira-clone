import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadSingleAttachment as apiUploadSingleAttachment } from '../../services/apiAttachments';

export function useUploadSingleAttachment() {
  const queryClient = useQueryClient();

  const { mutate: uploadSingleAttachment, status } = useMutation({
    mutationFn: ({
      file,
      entityType,
      entityId,
    }: {
      file: File;
      entityType: string;
      entityId: number;
    }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityType', entityType);
      formData.append('entityId', entityId.toString());
      return apiUploadSingleAttachment(formData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['attachment', variables.entityType, variables.entityId],
      });
    },
  });

  const isUploadingAttachment = status === 'pending';

  return { uploadSingleAttachment, isUploadingAttachment };
}
