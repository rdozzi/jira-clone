import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as apiLogin } from '../../services/apiAuth';

export function useLogin() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: (loginData: { email: string; password: string }) => {
      return apiLogin(loginData);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['userSelf'] });
    },
  });

  return {
    newLoginInfo: mutation.mutateAsync,
    loginInfoLoading: mutation.status === 'pending',
  };
}
