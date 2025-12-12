import { useQuery } from '@tanstack/react-query';
import { getTicketsByAssigneeId as apiGetTicketsByAssigneeId } from '../../services/apiTickets';
import { useUser } from '../../contexts/useUser';

export function useGetTicketByAssigneeId(userId: number | undefined) {
  const { orgId } = useUser();
  const {
    isLoading: isFetchingTicketsById,
    data: ticketsById,
    error: ticketsByIdError,
  } = useQuery({
    queryKey: ['tickets', 'assignee', userId, orgId],
    queryFn: () => {
      if (!userId) throw new Error('No userId provided!');
      return apiGetTicketsByAssigneeId(userId);
    },
    staleTime: 0,
    enabled: !!userId && !!orgId,
  });

  return { isFetchingTicketsById, ticketsById, ticketsByIdError };
}
