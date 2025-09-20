import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../../services/apiProjects';

export function useGetProjects() {
  const {
    isLoading,
    data: projects,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return { isLoading, projects, error };
}
