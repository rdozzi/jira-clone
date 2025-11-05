import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser as apiUpdateUser } from '../../services/apiUsers';

type EditUserParams = { userId: number; values: any };

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUser, status } = useMutation({
    mutationFn: ({ userId, values }: EditUserParams) => {
      return apiUpdateUser(userId, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const isUpdatingUser = status === 'pending';

  return { updateUser, isUpdatingUser };
}
