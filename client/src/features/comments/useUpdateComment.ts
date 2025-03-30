import { useQueryClient, useMutation } from '@tanstack/react-query';
import { editComment as apiEditComment } from '../../services/apiComments';

type EditCommentParams = {
  commentId: number;
  content: string;
};

export function useUpdateComment(recordId: number) {
  const queryClient = useQueryClient();
  const { mutate: editComment, status } = useMutation({
    mutationFn: ({ commentId, content }: EditCommentParams) =>
      apiEditComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments-by-ticket', recordId],
      });
    },
  });

  const isUpdating = status === 'pending';

  return { editComment, isUpdating };
}
