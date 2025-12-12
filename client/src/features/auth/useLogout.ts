import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout as apiLogout } from '../../services/apiAuth';
import { useAuth } from '../../contexts/useAuth';

export function useLogout() {
  const { logout: providerLogout, authState } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: () => apiLogout(authState?.token),
    onSuccess: () => {
      queryClient.clear();
      providerLogout();
    },
  });

  return mutation;
}
