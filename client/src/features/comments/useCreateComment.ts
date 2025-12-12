import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment as apiCreateComment } from '../../services/apiComments';
import { useUser } from '../../contexts/useUser';

export function useCreateComment(recordId: number) {
  const { orgId } = useUser();
  const queryClient = useQueryClient();
  const { mutate: createNewComment, status } = useMutation({
    mutationFn: apiCreateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments-by-ticket', recordId, orgId],
      });
    },
  });

  const isCreating = status === 'pending';

  return { createNewComment, isCreating };
}
