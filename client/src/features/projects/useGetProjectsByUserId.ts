import { useQuery } from '@tanstack/react-query';
import { getProjectsByUserId } from '../../services/apiProjects';
import { useUser } from '../../contexts/useUser';
import { useAuth } from '../../contexts/useAuth';

export function useGetProjectsByUserId() {
  const { isAuthenticated } = useAuth();
  const { orgId } = useUser();
  const {
    isLoading,
    data: projects,
    error,
  } = useQuery({
    queryKey: ['projects', orgId],
    queryFn: getProjectsByUserId,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    enabled: !!orgId && isAuthenticated,
    refetchOnWindowFocus: false,
  });

  return { isLoading, projects, error };
}
