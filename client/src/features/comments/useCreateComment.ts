import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment as apiCreateComment } from '../../services/apiComments';

export function useCreateComment(recordId: number) {
  const queryClient = useQueryClient();
  const { mutate: createNewComment, status } = useMutation({
    mutationFn: apiCreateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments-by-ticket', recordId],
      });
    },
  });

  const isCreating = status === 'pending';

  return { createNewComment, isCreating };
}
