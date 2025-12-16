import { useQuery } from '@tanstack/react-query';
import { getCommentsById as apiGetCommentsById } from '../../services/apiComments';
import { useUser } from '../../contexts/useUser';
import { useAuth } from '../../contexts/useAuth';

export function useGetCommentsById(recordId: number) {
  const { isAuthenticated } = useAuth();
  const { orgId } = useUser();
  const {
    isLoading: isFetching,
    data: comments,
    error,
  } = useQuery({
    queryKey: ['comments-by-ticket', recordId, orgId],
    queryFn: () => apiGetCommentsById(recordId),
    staleTime: 0,
    enabled: !!recordId && !!orgId && isAuthenticated, // Only run the query if commentId is truthy
  });

  return { isFetching, comments, error };
}
