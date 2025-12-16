import { useQuery } from '@tanstack/react-query';
import { getTicketById as apiGetTicketById } from '../../services/apiTickets';
import { useUser } from '../../contexts/useUser';
import { useAuth } from '../../contexts/useAuth';

export function useGetTicketById(ticketId: any) {
  const { isAuthenticated } = useAuth();
  const { orgId } = useUser();
  const {
    isLoading: isFetching,
    data: ticket,
    error,
  } = useQuery({
    queryKey: ['ticket', ticketId, orgId],
    queryFn: () => apiGetTicketById(ticketId),
    staleTime: 0,
    enabled: !!ticketId && isAuthenticated,
  });

  return { isFetching, ticket, error };
}
