import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProjectMemberRole as apiUpdateProjectMemberRole } from '../../services/apiProjectMembers';
import { ProjectMember } from '../../types/ProjectMember';

export function useUpdateProjectMemberRole() {
  const queryClient = useQueryClient();

  const { mutate: updateProjectMemberRole, status } = useMutation({
    mutationFn: ({
      projectId,
      userId,
      projectRole,
    }: {
      projectId: number;
      userId: number;
      projectRole: any;
    }) => {
      return apiUpdateProjectMemberRole(projectId, userId, projectRole);
    },
    onSuccess: (updatedProjectMember) => {
      queryClient.setQueryData(
        ['projectMembers'],
        (oldProjectMembers: ProjectMember[] = []) =>
          oldProjectMembers.map((m) =>
            m.id === updatedProjectMember.id
              ? { ...m, ...updatedProjectMember }
              : m
          )
      );

      queryClient.invalidateQueries({ queryKey: ['projectMembers'] });
    },
    onError: (error) => {
      console.error('Mutation Failed:', error);
    },
  });

  const isUpdatingProjectMemberRole = status === 'pending';

  return { updateProjectMemberRole, isUpdatingProjectMemberRole };
}
