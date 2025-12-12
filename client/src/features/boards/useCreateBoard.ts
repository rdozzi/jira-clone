import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBoard as apiCreateBoard } from '../../services/apiBoards';
import { useUser } from '../../contexts/useUser';

export function useCreateBoard() {
  const { orgId } = useUser();
  const queryClient = useQueryClient();
  const { mutate: createBoard, status } = useMutation({
    mutationFn: apiCreateBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', orgId] });
    },
  });

  const isCreatingBoard = status === 'pending';

  return { createBoard, isCreatingBoard };
}
