import { useQuery } from '@tanstack/react-query';
import { getProjectMembers as apiGetProjectMembers } from '../../services/apiProjectMembers';

export function useGetProjectMembers(projectId: number | null | undefined) {
  const {
    data: projectMembers,
    isLoading: isLoadingProjectMember,
    error,
    refetch: refreshProjectMember,
  } = useQuery({
    queryKey: ['projectMembers', projectId],
    queryFn: () => apiGetProjectMembers(projectId as number),
    enabled: !!projectId,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return {
    isLoadingProjectMember,
    projectMembers,
    error,
    refreshProjectMember,
  };
}
