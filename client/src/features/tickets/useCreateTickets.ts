import { useMutation, useQueryClient } from '@tanstack/react-query';
// Import react-hot-toast eventually
import { createTicket } from '../../services/apiTickets';
import { useUser } from '../../contexts/useUser';

export function useCreateTickets() {
  const { orgId } = useUser();
  const queryClient = useQueryClient();
  const { mutate: createNewTicket, status } = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', orgId] });
    },
  });

  const isCreating = status === 'pending';

  return { createNewTicket, isCreating };
}
