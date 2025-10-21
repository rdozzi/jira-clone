import { ReactNode } from 'react';
import { ProjectMemberContext } from './ProjectMemberContext';
import { useGetProjectMembers } from '../features/projectMember/useGetProjectMembers';
import { useProjectInfo } from './useProjectInfo';

interface ProjectMemberProviderProps {
  children: ReactNode;
}

export const ProjectMemberProvider = ({
  children,
}: ProjectMemberProviderProps) => {
  const { selectedProject } = useProjectInfo();

  const {
    projectMembers,
    isLoadingProjectMember,
    error,
    refreshProjectMember,
  } = useGetProjectMembers(selectedProject?.id);

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
