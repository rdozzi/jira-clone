import { useQuery } from '@tanstack/react-query';
import { getLogByUserId as apiGetLogByUserId } from '../../services/apiActivityLog';
import { useUser } from '../../contexts/useUser';
import { useAuth } from '../../contexts/useAuth';

export function useGetLogByUserId(userId: number | undefined) {
  const { isAuthenticated } = useAuth();
  const { orgId } = useUser();
  const {
    isLoading: isFetchingLogs,
    data: activityLogs,
    error: activityLogsError,
  } = useQuery({
    queryKey: ['activityLogs', userId, orgId],
    queryFn: () => {
      if (!userId) throw new Error('No userId provided!');
      return apiGetLogByUserId(userId);
    },
    staleTime: 0,
    enabled: !!userId && !!orgId && isAuthenticated,
  });

  return { isFetchingLogs, activityLogs, activityLogsError };
}
