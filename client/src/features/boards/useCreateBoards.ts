import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBoard } from '../../services/apiBoards';

export function useCreateTickets() {
  const queryClient = useQueryClient();
  const { mutate: createNewBoard, status } = useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const isCreatingBoard = status === 'pending';

  return { createNewBoard, isCreatingBoard };
}
