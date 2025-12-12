import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBoard as apiUpdateBoard } from '../../services/apiBoards';
import { useUser } from '../../contexts/useUser';
import { Boards } from '../../types/Boards';

export function useUpdateBoard() {
  const { orgId } = useUser();
  const queryClient = useQueryClient();

  const { mutate: updateBoard, status } = useMutation({
    mutationFn: ({ boardId, values }: { boardId: number; values: any }) => {
      return apiUpdateBoard(boardId, values);
    },
    onSuccess: (updatedBoard) => {
      queryClient.setQueryData(['boards'], (oldBoards: Boards[] = []) =>
        oldBoards.map((b) =>
          b.id === updatedBoard.id ? { ...b, ...updatedBoard } : b
        )
      );

      queryClient.invalidateQueries({ queryKey: ['boards', orgId] });
    },
    onError: (error) => {
      console.error('Mutation Failed:', error);
    },
  });

  const isUpdatingBoard = status === 'pending';

  return { updateBoard, isUpdatingBoard };
}
