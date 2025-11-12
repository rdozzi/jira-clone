import { useQuery } from '@tanstack/react-query';
import { getLogByUserId as apiGetLogByUserId } from '../../services/apiActivityLog';

export function useGetLogByUserId(userId: number | undefined) {
  const {
    isLoading: isFetchingLogs,
    data: activityLogs,
    error: activityLogsError,
  } = useQuery({
    queryKey: ['activityLogs', userId],
    queryFn: () => {
      if (!userId) throw new Error('No userId provided!');
      return apiGetLogByUserId(userId);
    },
    staleTime: 0,
    enabled: !!userId,
  });

  return { isFetchingLogs, activityLogs, activityLogsError };
}
