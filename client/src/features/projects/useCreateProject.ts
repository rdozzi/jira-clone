import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject as apiCreateProject } from '../../services/apiProjects';
import { useUser } from '../../contexts/useUser';

export function useCreateProject() {
  const { orgId } = useUser();
  const queryClient = useQueryClient();
  const {
    mutate: createProject,
    status,
    error: createProjectError,
  } = useMutation({
    mutationFn: apiCreateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', orgId] });
    },
  });

  const isCreatingProject = status === 'pending';

  return { createProject, isCreatingProject, createProjectError };
}
