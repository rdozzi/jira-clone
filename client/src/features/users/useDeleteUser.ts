import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { deleteUser as apiDeleteUser } from '../../services/apiUsers';
import { useUser } from '../../contexts/useUser';

export function useDeleteUser() {
  const { orgId } = useUser();
  const queryClient = useQueryClient();
  const {
    mutate: deleteUser,
    status,
    error,
  } = useMutation({
    mutationFn: apiDeleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizationUsers', orgId] });
      message.success('User successfully deleted');
    },

    onError: () => {
      message.error('Error while deleting user');
    },
  });

  const isDeletingUser = status === 'pending';

  return { deleteUser, isDeletingUser, error };
}
