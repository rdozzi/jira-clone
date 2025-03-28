import { useQuery } from '@tanstack/react-query';
import { getCommentsById as apiGetCommentsById } from '../../services/apiComments';

export function useGetCommentsById(commentId: number) {
  const {
    isLoading: isFetching,
    data: comments,
    error,
  } = useQuery({
    queryKey: ['comment', commentId],
    queryFn: () => apiGetCommentsById(commentId),
    enabled: !!commentId, // Only run the query if commentId is truthy
  });

  return { isFetching, comments, error };
}
