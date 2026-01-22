import { useQuery } from '@tanstack/react-query';
import { getProjects, getProjectsByUserId } from '../../services/apiProjects';
import { useGetUserSelf } from '../users/useGetUserSelf';
import { useUser } from '../../contexts/useUser';
import { useAuth } from '../../contexts/useAuth';

// Scope defined to prevent caching collisions between different project views that call getProjects or getProjectsByUserId
type Scope = 'main' | 'info';

export function useGetProjects(scope: Scope) {
  const { orgId } = useUser();
  const { userSelf } = useGetUserSelf();
  const { isAuthenticated } = useAuth();
  const isAdmin =
    userSelf?.organizationRole === 'ADMIN' ||
    userSelf?.organizationRole === 'SUPERADMIN';

  const {
    isLoading,
    data: projects,
    error,
  } = useQuery({
    queryKey: ['projects', scope, orgId],
    queryFn: () => {
      if (isAdmin) {
        return getProjects();
      } else {
        return getProjectsByUserId();
      }
    },
    enabled: !!userSelf && !!orgId && isAuthenticated,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return { isLoading, projects, error };
}
