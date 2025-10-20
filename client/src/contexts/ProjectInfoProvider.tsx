import { useState, useEffect } from 'react';
import { useGetProjects } from '../features/projects/useGetProjects';
import { Projects } from '../types/Projects';
import { ProjectInfoContext } from './ProjectInfoContext';
import { useProjectBoard } from './useProjectBoard';

type ProjectInfoProviderProps = { children: React.ReactNode };

export function ProjectInfoProvider({ children }: ProjectInfoProviderProps) {
  const {
    projects,
    isLoading: isProjectLoading,
    // error: projectInfoError,
  } = useGetProjects('info');
  const { project } = useProjectBoard();

  const initialProject = projects?.find((p: Projects) => p.id === project?.id);

  const [selectedProject, setSelectedProject] = useState<Projects | null>(null);
  const [projectIdNumber, setProjectIdNumber] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedProject && initialProject) {
      setSelectedProject(initialProject);
      setProjectIdNumber(initialProject.id);
    }
  }, [initialProject, selectedProject, project]);

  useEffect(() => {
    if (selectedProject) {
      setProjectIdNumber(selectedProject.id);
    }
  }, [selectedProject]);

  const typedProjects = (projects as Projects[]) || null;
  return (
    <ProjectInfoContext.Provider
      value={{
        isProjectLoading,
        selectedProject,
        setSelectedProject,
        typedProjects,
        projectIdNumber: projectIdNumber ?? -1,
      }}
    >
      {children}
    </ProjectInfoContext.Provider>
  );
}
