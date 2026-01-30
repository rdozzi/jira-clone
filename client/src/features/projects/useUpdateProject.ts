import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProject as apiUpdateProject } from '../../services/apiProjects';
import { Project } from '../../types/Project';
import { useUser } from '../../contexts/useUser';

export function useUpdateProject() {
  const { orgId } = useUser();
  const queryClient = useQueryClient();

  const {
    mutate: updateProject,
    status,
    error: projectUpdateError,
  } = useMutation({
    mutationFn: ({ projectId, values }: { projectId: number; values: any }) => {
      return apiUpdateProject(projectId, values);
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(
        ['projects', orgId],
        (oldProjects: Project[] = []) =>
          oldProjects.map((p) =>
            p.id === updatedProject.id ? { ...p, ...updatedProject } : p,
          ),
      );

      queryClient.invalidateQueries({ queryKey: ['projects', orgId] });
    },
    onError: (error) => {
      console.error('Mutation Failed:', error);
    },
  });

  const isUpdatingProject = status === 'pending';

  return { updateProject, isUpdatingProject, projectUpdateError };
}
