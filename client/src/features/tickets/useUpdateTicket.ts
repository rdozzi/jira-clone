import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTicket as apiUpdateTicket } from '../../services/apiTickets';
import { Tickets } from '../../types/Tickets';

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  const { mutate: updateTicket, status } = useMutation({
    mutationFn: ({ ticketId, values }: { ticketId: number; values: any }) => {
      return apiUpdateTicket(ticketId, values);
    },
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData(['tickets'], (oldTickets: Tickets[] = []) => {
        return oldTickets.map((t) => {
          if (t.id === updatedTicket.id) {
            return { ...t, ...updatedTicket };
          }
          return t;
        });
      });
    },
    onError: (error) => {
      console.error('Mutation Failed:', error);
    },
  });

  const isUpdating = status === 'pending';

  return { updateTicket, isUpdating };
}
