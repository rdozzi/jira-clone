import { useQuery } from '@tanstack/react-query';
import { getTickets } from '../../services/apiTickets';

export function useGetTickets() {
  const {
    isLoading,
    data: tickets,
    error,
  } = useQuery({
    queryKey: ['tickets'],
    queryFn: getTickets,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return { isLoading, tickets, error };
}
