import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment as apiDeleteComment } from '../../services/apiComments';

export function useDeleteComment(recordId: number) {
  const queryClient = useQueryClient();
  const { mutate: deleteComment, status } = useMutation({
    mutationFn: (commentId: number) => apiDeleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments-by-ticket', recordId],
      });
    },
  });

  const isDeleting = status === 'pending';

  return { deleteComment, isDeleting };
}
