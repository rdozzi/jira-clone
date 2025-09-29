import { useQuery } from '@tanstack/react-query';
import { getProjects, getProjectsByUserId } from '../../services/apiProjects';
import { useGetUserSelf } from '../users/useGetUserSelf';

export function useGetProjects() {
  const { userSelf } = useGetUserSelf();
  const isAdmin =
    userSelf?.organizationRole === 'ADMIN' ||
    userSelf?.organizationRole === 'SUPERADMIN';

  const {
    isLoading,
    data: projects,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: () => {
      if (isAdmin) {
        return getProjects();
      } else {
        return getProjectsByUserId();
      }
    },
    // queryFn: getProjects,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return { isLoading, projects, error };
}
