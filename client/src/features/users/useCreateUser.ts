import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser as apiCreateUser } from '../../services/apiUsers';
import { useUser } from '../../contexts/useUser';
import { message } from 'antd';

export function useCreateUser() {
  const { orgId } = useUser();
  const queryClient = useQueryClient();
  const {
    mutate: createUser,
    status,
    error,
  } = useMutation({
    mutationFn: apiCreateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizationUsers', orgId] });
      message.success('User created successfully');
    },
    onError: () => {
      message.error('Error creating user');
    },
  });

  const isCreating = status === 'pending';

  return { createUser, isCreating, error };
}
