import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTicket as apiDeleteTicket } from '../../services/apiTickets';

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  const { mutate: deleteTicket, status } = useMutation({
    mutationFn: apiDeleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const isDeleting = status === 'pending';

  return { deleteTicket, isDeleting };
}
