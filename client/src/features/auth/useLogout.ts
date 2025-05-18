import { useMutation } from '@tanstack/react-query';
import { logout as apiLogout } from '../../services/apiAuth';

export function useLogout() {
  const authData = localStorage.getItem('auth');
  if (!authData) {
    throw new Error('Auth data not found in localStorage');
  }
  const { token } = JSON.parse(authData);
  if (!token) {
    throw new Error('Token not found in auth data');
  }
  const logoutMutation = useMutation({
    mutationFn: () => apiLogout(token),
  });

  return logoutMutation;
}
