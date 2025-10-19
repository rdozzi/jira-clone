import { useQuery } from '@tanstack/react-query';
import { getProjects, getProjectsByUserId } from '../../services/apiProjects';
import { useGetUserSelf } from '../users/useGetUserSelf';

type Scope = 'main' | 'info';

export function useGetProjects(scope: Scope) {
  const { userSelf } = useGetUserSelf();
  const isAdmin =
    userSelf?.organizationRole === 'ADMIN' ||
    userSelf?.organizationRole === 'SUPERADMIN';

  const {
    isLoading,
    data: projects,
    error,
  } = useQuery({
    queryKey: ['projects', scope],
    queryFn: () => {
      if (isAdmin) {
        return getProjects();
      } else {
        return getProjectsByUserId();
      }
    },
    enabled: !!userSelf,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return { isLoading, projects, error };
}
