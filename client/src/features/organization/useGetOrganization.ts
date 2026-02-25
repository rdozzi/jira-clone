import { useQuery } from '@tanstack/react-query';
import { getOrganization } from '../../services/apiOrganization';
import { useUser } from '../../contexts/useUser';
import { useAuth } from '../../contexts/useAuth';

export function useGetOrganization() {
  const { isAuthenticated } = useAuth();
  const { orgId } = useUser();
  const {
    isLoading,
    data: organization,
    error,
  } = useQuery({
    queryKey: ['organization', orgId],
    queryFn: getOrganization,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    enabled: !!orgId && isAuthenticated,
  });

  return { isLoading, organization, error };
}
