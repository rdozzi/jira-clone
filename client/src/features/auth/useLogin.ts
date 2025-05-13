import { useMutation, useQueryClient } from '@tanstack/react-query';
// Import react-hot-toast eventually
import { login as apiLogin } from '../../services/apiAuth';

export function useLogin() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    // mutationFn: apiLogin,
    mutationFn: (loginData: { email: string; password: string }) => {
      return apiLogin(loginData);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['login'] });
    },
  });

  return {
    newLoginInfo: mutation.mutateAsync,
    loginInfoLoading: mutation.status === 'pending',
  };
}
