import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBoard as apiDeleteBoard } from '../../services/apiBoards';
import { useUser } from '../../contexts/useUser';

export function useDeleteBoard() {
  const { orgId } = useUser();
  const queryClient = useQueryClient();
  const { mutate: deleteBoard, status } = useMutation({
    mutationFn: apiDeleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', orgId] });
    },
  });

  const isDeletingBoard = status === 'pending';

  return { deleteBoard, isDeletingBoard };
}
