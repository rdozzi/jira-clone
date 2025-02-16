import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTicket as apiUpdateTicket } from '../../services/apiTickets';

export function useUpdateTicket(ticketId: any, values: any) {
  const queryClient = useQueryClient();

  const { mutate: updateTicket, status } = useMutation({
    mutationFn: ({ ticketId, values }: { ticketId: number; values: any }) =>
      apiUpdateTicket(ticketId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const isUpdating = status === 'pending';

  return { updateTicket, isUpdating };
}
