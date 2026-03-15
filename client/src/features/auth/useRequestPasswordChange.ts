import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { requestPasswordChange as apiRequestPasswordChange } from '../../services/apiAuth';

export function useRequestPasswordChange() {
  const {
    mutate: requestPasswordChange,
    status,
    error: requestEmailError,
  } = useMutation({
    mutationFn: apiRequestPasswordChange,
    onSuccess: () => {
      message.success('A reset email has been sent to this account.');
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      if (status === 400 || status === 409) {
        message.error(
          'We could not process your request. Please verify the information and try again.',
        );
      } else {
        message.error('An unexpected error occurred. Please try again later.');
      }
    },
  });

  const isRequestingEmail = status === 'pending';

  return {
    requestPasswordChange,
    isRequestingEmail,
    requestEmailError,
  };
}
