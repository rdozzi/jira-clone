import { useMutation, useQueryClient } from '@tanstack/react-query';
// Import react-hot-toast eventually
import { createTicket } from '../../services/apiTickets';

export function useCreateTickets() {
  const queryClient = useQueryClient();
  const { mutate: createNewTicket, status } = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const isCreating = status === 'pending';

  return { createNewTicket, isCreating };
}
