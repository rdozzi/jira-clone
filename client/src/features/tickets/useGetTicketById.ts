import { useQuery } from '@tanstack/react-query';
import { getTicketById as apiGetTicketById } from '../../services/apiTickets';

export function useGetTicketById(ticketId: any) {
  const {
    isLoading,
    data: ticket,
    error,
  } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => apiGetTicketById(ticketId),
    enabled: !!ticketId, // Only run the query if ticketId is truthy
  });

  return { isLoading, ticket, error };
}
