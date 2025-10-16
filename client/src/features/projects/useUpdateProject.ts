import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProject as apiUpdateProject } from '../../services/apiProjects';
import { Projects } from '../../types/Projects';

export function useUpdateProject() {
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
      queryClient.setQueryData(['projects'], (oldProjects: Projects[] = []) =>
        oldProjects.map((p) =>
          p.id === updatedProject.id ? { ...p, ...updatedProject } : p
        )
      );

      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Mutation Failed:', error);
    },
  });

  const isUpdatingProject = status === 'pending';

  return { updateProject, isUpdatingProject, projectUpdateError };
}
