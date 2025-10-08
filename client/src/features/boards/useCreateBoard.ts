import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBoard as apiCreateBoard } from '../../services/apiBoards';

export function useCreateBoard() {
  const queryClient = useQueryClient();
  const { mutate: createBoard, status } = useMutation({
    mutationFn: apiCreateBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const isCreatingBoard = status === 'pending';

  return { createBoard, isCreatingBoard };
}
