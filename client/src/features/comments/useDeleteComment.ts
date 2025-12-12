import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment as apiDeleteComment } from '../../services/apiComments';
import { useUser } from '../../contexts/useUser';

export function useDeleteComment(recordId: number) {
  const { orgId } = useUser();
  const queryClient = useQueryClient();
  const { mutate: deleteComment, status } = useMutation({
    mutationFn: (commentId: number) => apiDeleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments-by-ticket', recordId, orgId],
      });
    },
  });

  const isDeleting = status === 'pending';

  return { deleteComment, isDeleting };
}
