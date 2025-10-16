import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject as apiCreateProject } from '../../services/apiProjects';

export function useCreateProject() {
  const queryClient = useQueryClient();
  const {
    mutate: createProject,
    status,
    error: createProjectError,
  } = useMutation({
    mutationFn: apiCreateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const isCreatingProject = status === 'pending';

  return { createProject, isCreatingProject, createProjectError };
}
