import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { changePasswordPublic as apiChangePasswordPublic } from '../../services/apiAuth';

export function useChangePasswordPublic() {
  const {
    mutate: changePasswordPublic,
    status,
    error: changePasswordPublicError,
  } = useMutation({
    mutationFn: apiChangePasswordPublic,
    onSuccess: () => {
      message.success('Your password was updated successfully');
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      if (status === 400 || status === 409) {
        message.error('We could not process your request. Please try again.');
      } else {
        message.error('An unexpected error occurred. Please try again later.');
      }
    },
  });

  const isChangingPassword = status === 'pending';

  return {
    changePasswordPublic,
    isChangingPassword,
    changePasswordPublicError,
  };
}
