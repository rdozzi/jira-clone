import { useQuery } from '@tanstack/react-query';
import { getTicketsByBoardId } from '../../services/apiTickets';

export function useGetTicketsByBoardId(boardId: number | null) {
  const {
    isLoading,
    data: tickets,
    error,
  } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => getTicketsByBoardId(boardId as number),
    enabled: !!boardId,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return { isLoading, tickets, error };
}
