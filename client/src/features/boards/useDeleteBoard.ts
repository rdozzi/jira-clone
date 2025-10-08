import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBoard as apiDeleteBoard } from '../../services/apiBoards';

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  const { mutate: deleteBoard, status } = useMutation({
    mutationFn: apiDeleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const isDeletingBoard = status === 'pending';

  return { deleteBoard, isDeletingBoard };
}
