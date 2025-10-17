import { useQuery } from '@tanstack/react-query';
import { getCommentsById as apiGetCommentsById } from '../../services/apiComments';

export function useGetCommentsById(recordId: number) {
  const {
    isLoading: isFetching,
    data: comments,
    error,
  } = useQuery({
    queryKey: ['comments-by-ticket', recordId],
    queryFn: () => apiGetCommentsById(recordId),
    staleTime: 0,
    enabled: !!recordId, // Only run the query if commentId is truthy
  });

  return { isFetching, comments, error };
}
