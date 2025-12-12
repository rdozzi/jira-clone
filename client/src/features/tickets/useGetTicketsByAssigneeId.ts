import { useQuery } from '@tanstack/react-query';
import { getTicketsByAssigneeId as apiGetTicketsByAssigneeId } from '../../services/apiTickets';

export function useGetTicketByAssigneeId(userId: number | undefined) {
  const {
    isLoading: isFetchingTicketsById,
    data: ticketsById,
    error: ticketsByIdError,
  } = useQuery({
    queryKey: ['tickets', 'assignee', userId],
    queryFn: () => {
      if (!userId) throw new Error('No userId provided!');
      return apiGetTicketsByAssigneeId(userId);
    },
    staleTime: 0,
    enabled: !!userId, // Only run the query if ticketId is truthy
  });

  return { isFetchingTicketsById, ticketsById, ticketsByIdError };
}
