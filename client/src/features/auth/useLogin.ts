import { message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as apiLogin } from '../../services/apiAuth';

export function useLogin() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: (loginData: { email: string; password: string }) => {
      return apiLogin(loginData);
    },
    onError: (error: any) => {
      if (error.status === 401) {
        message.error('Check email or password.');
      } else if (error.status === 429) {
        message.error('Too many login attempts. Please try again later.');
      } else if (!error.status) {
        message.error('Network error. Please check your connection.');
      } else {
        message.error('Unable to login. Please try again.');
      }
    },
    onSuccess: () => {
      console.log('inside onSuccess');
      queryClient.removeQueries({ queryKey: ['userSelf'] });
      message.success('Login was successul');
    },
  });

  return {
    newLoginInfo: mutation.mutateAsync,
    loginInfoLoading: mutation.status === 'pending',
  };
}
