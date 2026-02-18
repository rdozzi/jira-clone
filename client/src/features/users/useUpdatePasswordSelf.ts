import { useMutation } from '@tanstack/react-query';
import { updateUserPasswordSelf as apiUpdateUserPasswordSelf } from '../../services/apiUsers';
import { message } from 'antd';

export function useUpdatePasswordSelf() {
  const {
    mutate: updateUserPasswordSelf,
    status,
    error: passwordUpdateError,
  } = useMutation({
    mutationFn: ({
      newPassword,
      confirmPassword,
    }: {
      newPassword: string;
      confirmPassword: string;
    }) => apiUpdateUserPasswordSelf(newPassword, confirmPassword),

    onError: () => {
      message.error('Error while updating password. Please try again later.');
    },

    onSuccess: () => {
      message.success('Password was updated successfully!');
    },
  });

  const isUpdatingPassword = status === 'pending';

  return { updateUserPasswordSelf, isUpdatingPassword, passwordUpdateError };
}
