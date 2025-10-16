import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject as apiDeleteProject } from '../../services/apiProjects';

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const {
    mutate: deleteProject,
    status,
    error: deleteProjectError,
  } = useMutation({
    mutationFn: apiDeleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const isDeletingProject = status === 'pending';

  return { deleteProject, isDeletingProject, deleteProjectError };
}
