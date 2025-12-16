import { useQuery } from '@tanstack/react-query';
import { getTicketsByAssigneeId as apiGetTicketsByAssigneeId } from '../../services/apiTickets';
import { useUser } from '../../contexts/useUser';
import { useAuth } from '../../contexts/useAuth';

export function useGetTicketByAssigneeId(userId: number | undefined) {
  const { isAuthenticated } = useAuth();
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
    enabled: !!userId && !!orgId && isAuthenticated,
  });

  return { isFetchingTicketsById, ticketsById, ticketsByIdError };
}
