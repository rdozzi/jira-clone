import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProjectMember as apiAddProjectMember } from '../../services/apiProjectMembers';
import { useUser } from '../../contexts/useUser';

export function useAddProjectMember() {
  const { orgId } = useUser();
  const queryClient = useQueryClient();
  const { mutate: addProjectMember, status } = useMutation({
    mutationFn: ({
      projectId,
      memberInfo,
    }: {
      projectId: number;
      memberInfo: any;
    }) => apiAddProjectMember(projectId, memberInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', orgId] });
    },
  });

  const isAddingProjectMember = status === 'pending';

  return { addProjectMember, isAddingProjectMember };
}
