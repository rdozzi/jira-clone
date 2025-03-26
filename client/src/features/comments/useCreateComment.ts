import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment as apiCreateComment } from '../../services/apiComments';

export function useCreateComment() {
  const queryClient = useQueryClient();
  const { mutate: createNewComment, status } = useMutation({
    mutationFn: apiCreateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const isCreating = status === 'pending';

  return { createNewComment, isCreating };
}
