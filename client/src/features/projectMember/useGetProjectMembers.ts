import { useQuery } from '@tanstack/react-query';
import { getProjectMembers as apiGetProjectMembers } from '../../services/apiProjectMembers';
import { useUser } from '../../contexts/useUser';
import { useAuth } from '../../contexts/useAuth';

export function useGetProjectMembers(projectId: number | null | undefined) {
  const { orgId } = useUser();
  const { isAuthenticated } = useAuth();
  const {
    data: projectMembers,
    isLoading: isLoadingProjectMember,
    error,
    refetch: refreshProjectMember,
  } = useQuery({
    queryKey: ['projectMembers', projectId, orgId],
    queryFn: () => apiGetProjectMembers(projectId as number),
    enabled: !!projectId && projectId > 0 && !!orgId && isAuthenticated,
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
