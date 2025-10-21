import { useState, useEffect } from 'react';
import { useGetProjects } from '../features/projects/useGetProjects';
import { Projects } from '../types/Projects';
import { ProjectInfoContext } from './ProjectInfoContext';

type ProjectInfoProviderProps = { children: React.ReactNode };

export function ProjectInfoProvider({ children }: ProjectInfoProviderProps) {
  const {
    projects,
    isLoading: isProjectLoading,
    // error: projectInfoError,
  } = useGetProjects('info');

  const initialProject = projects ? projects[0] : null;

  const [selectedProject, setSelectedProject] = useState<Projects | null>(null);
  const [projectIdNumber, setProjectIdNumber] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedProject && initialProject) {
      setSelectedProject(initialProject);
      setProjectIdNumber(initialProject.id);
    }
  }, [initialProject, selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      setSelectedProject(selectedProject);
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
        setProjectIdNumber,
      }}
    >
      {children}
    </ProjectInfoContext.Provider>
  );
}
