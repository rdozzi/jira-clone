import { useQuery } from '@tanstack/react-query';
import { getTicketsByBoardId } from '../../services/apiTickets';
import { useUser } from '../../contexts/useUser';

export function useGetTicketsByBoardId(boardId: number | null) {
  const { orgId } = useUser();
  const {
    isLoading,
    data: tickets,
    error,
  } = useQuery({
    queryKey: ['tickets', boardId, orgId],
    queryFn: () => getTicketsByBoardId(boardId as number),
    enabled: !!boardId && !!orgId,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return { isLoading, tickets, error };
}
