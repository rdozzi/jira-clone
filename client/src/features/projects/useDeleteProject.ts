import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject as apiDeleteProject } from '../../services/apiProjects';
import { useUser } from '../../contexts/useUser';

export function useDeleteProject() {
  const { orgId } = useUser();
  const queryClient = useQueryClient();
  const {
    mutate: deleteProject,
    status,
    error: deleteProjectError,
  } = useMutation({
    mutationFn: apiDeleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', orgId] });
    },
  });

  const isDeletingProject = status === 'pending';

  return { deleteProject, isDeletingProject, deleteProjectError };
}
