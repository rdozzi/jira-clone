import { useQuery } from '@tanstack/react-query';
import { getUsersByProjectId as apiGetUsersByProjectId } from '../../services/apiUsers';
import { useUser } from '../../contexts/useUser';

export function useGetUsersByProjectId(projectId: number) {
  const { orgId } = useUser();
  const {
    isLoading: isLoadingUsers,
    data: projectUsers,
    error,
    refetch: refreshUsers,
  } = useQuery({
    queryKey: ['projectUsers', orgId],
    queryFn: () => apiGetUsersByProjectId(projectId),
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    enabled: !!orgId,
  });

  return { isLoadingUsers, projectUsers, error, refreshUsers };
}
