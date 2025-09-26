import { useQuery } from '@tanstack/react-query';
import { getProjectMembers as apiGetProjectMembers } from '../../services/apiProjectMembers';

export function useGetProjectMembers(projectId: number | null) {
  const {
    data: projectMembers,
    isLoading,
    error,
    refetch: refreshProjectMember,
  } = useQuery({
    queryKey: ['projectMember'],
    queryFn: () => apiGetProjectMembers(projectId as number),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return { isLoading, projectMembers, error, refreshProjectMember };
}
