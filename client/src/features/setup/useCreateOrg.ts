import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { createOrg as apiCreateOrg } from '../../services/apiSetup';

export function useCreateOrg() {
  const {
    mutate: createOrg,
    status,
    error: createOrgError,
  } = useMutation({
    mutationFn: apiCreateOrg,
    onSuccess: () => {
      message.success(
        'Request received. Check your email for further instructions.',
      );
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      if (status === 400 || status === 403 || status === 409) {
        message.error(
          'We could not process your request. Please verify the information and try again.',
        );
      } else {
        message.error('An unexpected error occurred. Please try again later.');
      }
    },
  });

  const isCreatingOrg = status === 'pending';

  return { createOrg, isCreatingOrg, createOrgError };
}
