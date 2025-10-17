import { useQuery } from '@tanstack/react-query';
import { getProjectMembers as apiGetProjectMembers } from '../../services/apiProjectMembers';

export function useGetProjectMembers(projectId: number | null) {
  const {
    data: projectMembers,
    isLoading: isLoadingProjectMember,
    error,
    refetch: refreshProjectMember,
  } = useQuery({
    queryKey: ['projectMembers'],
    queryFn: () => apiGetProjectMembers(projectId as number),
    enabled: projectId !== null,
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
