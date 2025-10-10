import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProjectMember as apiAddProjectMember } from '../../services/apiProjectMembers';

export function useAddProjectMember() {
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
      queryClient.invalidateQueries({ queryKey: ['projectMembers'] });
    },
  });

  const isAddingProjectMember = status === 'pending';

  return { addProjectMember, isAddingProjectMember };
}
