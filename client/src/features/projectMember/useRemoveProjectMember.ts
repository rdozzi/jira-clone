import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeProjectMember as apiRemoveProjectMember } from '../../services/apiProjectMembers';
import { useUser } from '../../contexts/useUser';

export function useRemoveProjectMember() {
  const { orgId } = useUser();
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
      queryClient.invalidateQueries({ queryKey: ['projectMembers', orgId] });
    },
  });

  const isRemovingProjectMember = status === 'pending';

  return { removeProjectMember, isRemovingProjectMember };
}
