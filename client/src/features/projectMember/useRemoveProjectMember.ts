import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeProjectMember as apiRemoveProjectMember } from '../../services/apiProjectMembers';

export function useRemoveProjectMember() {
  const queryClient = useQueryClient();
  const { mutate: removeProjectMember, status } = useMutation({
    mutationFn: ({
      projectId,
      userId,
    }: {
      projectId: number;
      userId: number;
    }) => apiRemoveProjectMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers'] });
    },
  });

  const isRemovingProjectMember = status === 'pending';

  return { removeProjectMember, isRemovingProjectMember };
}
