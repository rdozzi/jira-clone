import { useState, useEffect } from 'react';
import { useGetProjects } from '../features/projects/useGetProjects';
import { Projects } from '../types/Projects';
import { ProjectInfoContext } from './ProjectInfoContext';

type ProjectInfoProviderProps = { children: React.ReactNode };

export function ProjectInfoProvider({ children }: ProjectInfoProviderProps) {
  const [selectedProject, setSelectedProject] = useState<Projects | null>(null);

  const {
    projects,
    isLoading: isProjectLoading,
    // error: projectInfoError,
  } = useGetProjects('info');

  useEffect(() => {
    if (!selectedProject && projects && projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  const projectIdNumber = selectedProject?.id ?? -1;

  const typedProjects = (projects as Projects[]) || null;

  return (
    <ProjectInfoContext.Provider
      value={{
        isProjectLoading,
        selectedProject,
        setSelectedProject,
        typedProjects,
        projectIdNumber,
      }}
    >
      {children}
    </ProjectInfoContext.Provider>
  );
}
