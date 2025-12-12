import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTicket as apiUpdateTicket } from '../../services/apiTickets';
import { useUser } from '../../contexts/useUser';
import { Tickets } from '../../types/Tickets';

export function useUpdateTicket() {
  const { orgId } = useUser();
  const queryClient = useQueryClient();

  const { mutate: updateTicket, status } = useMutation({
    mutationFn: ({ ticketId, values }: { ticketId: number; values: any }) => {
      return apiUpdateTicket(ticketId, values);
    },
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData(
        ['tickets', orgId],
        (oldTickets: Tickets[] = []) =>
          oldTickets.map((t) =>
            t.id === updatedTicket.id ? { ...t, ...updatedTicket } : t
          )
      );

      queryClient.invalidateQueries({ queryKey: ['tickets', orgId] });
    },
    onError: (error) => {
      console.error('Mutation Failed:', error);
    },
  });

  const isUpdating = status === 'pending';

  return { updateTicket, isUpdating };
}
