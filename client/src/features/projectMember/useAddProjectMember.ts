import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProjectMember as apiAddProjectMember } from '../../services/apiProjectMembers';

export function useAddProjectMember(projectId: number, memberInfo: any) {
  const queryClient = useQueryClient();
  const { mutate: addProjectMember, status } = useMutation({
    mutationFn: () => apiAddProjectMember(projectId, memberInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers'] });
    },
  });

  const isAddingProjectMember = status === 'pending';

  return { addProjectMember, isAddingProjectMember };
}
