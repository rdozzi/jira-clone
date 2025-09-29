import { useQuery } from '@tanstack/react-query';
import { getProjectsByUserId } from '../../services/apiProjects';

export function useGetProjectsByUserId() {
  const {
    isLoading,
    data: projects,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjectsByUserId,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return { isLoading, projects, error };
}
