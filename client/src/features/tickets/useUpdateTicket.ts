import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTicket as apiUpdateTicket } from '../../services/apiTickets';

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  const { mutate: updateTicket, status } = useMutation({
    mutationFn: ({ ticketId, values }: { ticketId: number; values: any }) => {
      return apiUpdateTicket(ticketId, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error) => {
      console.error('Mutation Failed:', error);
    },
  });

  const isUpdating = status === 'pending';

  return { updateTicket, isUpdating };
}
