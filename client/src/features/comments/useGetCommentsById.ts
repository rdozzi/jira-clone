import { useQuery } from '@tanstack/react-query';
import { getCommentsById as apiGetCommentsById } from '../../services/apiComments';
import { useUser } from '../../contexts/useUser';

export function useGetCommentsById(recordId: number) {
  const { orgId } = useUser();
  const {
    isLoading: isFetching,
    data: comments,
    error,
  } = useQuery({
    queryKey: ['comments-by-ticket', recordId, orgId],
    queryFn: () => apiGetCommentsById(recordId),
    staleTime: 0,
    enabled: !!recordId && !!orgId, // Only run the query if commentId is truthy
  });

  return { isFetching, comments, error };
}
