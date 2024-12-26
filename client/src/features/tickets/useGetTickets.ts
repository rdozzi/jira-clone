import { useQuery } from '@tanstack/react-query';
import { getTickets } from '../../services/apiTickets';

export function useGetTickets() {
  const {
    isLoading,
    data: tickets,
    error,
  } = useQuery({ queryKey: ['tickets'], queryFn: getTickets });

  return { isLoading, tickets, error };
}
