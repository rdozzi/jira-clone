import { useQuery } from '@tanstack/react-query';
import { getUsersByProjectId as apiGetUsersByProjectId } from '../../services/apiUsers';

export function useGetUsersByProjectId(projectId: number) {
  const {
    isLoading: isLoadingUsers,
    data: projectUsers,
    error,
    refetch: refreshUsers,
  } = useQuery({
    queryKey: ['projectUsers'],
    queryFn: () => apiGetUsersByProjectId(projectId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return { isLoadingUsers, projectUsers, error, refreshUsers };
}
