import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment as apiCreateComment } from '../../services/apiComments';

export function useCreateComment(commentId: number) {
  const queryClient = useQueryClient();
  const { mutate: createNewComment, status } = useMutation({
    mutationFn: apiCreateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment', commentId] });
    },
  });

  const isCreating = status === 'pending';

  return { createNewComment, isCreating };
}
