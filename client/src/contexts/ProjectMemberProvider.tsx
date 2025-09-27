import { ReactNode } from 'react';
import { ProjectMemberContext } from './ProjectMemberContext';
import { useGetProjectMembers } from '../features/projectMember/useGetProjectMembers';
import { useProjectBoard } from './useProjectBoard';

interface ProjectMemberProviderProps {
  children: ReactNode;
}

export const ProjectMemberProvider = ({
  children,
}: ProjectMemberProviderProps) => {
  const { projectId } = useProjectBoard();
  const {
    projectMembers,
    isLoadingProjectMember,
    error,
    refreshProjectMember,
  } = useGetProjectMembers(projectId);

  return (
    <ProjectMemberContext.Provider
      value={{
        projectMembers,
        isLoadingProjectMember,
        error,
        refreshProjectMember,
      }}
    >
      {children}
    </ProjectMemberContext.Provider>
  );
};
