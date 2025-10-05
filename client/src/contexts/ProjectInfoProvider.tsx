import { useState, useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useGetProjects } from '../features/projects/useGetProjects';
import { Projects } from '../types/Projects';
import { ProjectInfoContext } from './ProjectInfoContext';
import ProjectInfoSelector from '../ui/ProjectInfoSelector';
import ProjectInfoNav from '../ui/ProjectInfoNav';

export function ProjectInfoProvider() {
  const { projectId } = useParams();
  const {
    projects,
    isLoading: isProjectLoading,
    // error: projectError,
  } = useGetProjects();

  const projectIdNumber = Number(projectId);

  const [selectedProject, setSelectedProject] = useState<Projects | null>(null);

  useEffect(() => {
    const currentProject: Projects = projects?.find(
      (p: Projects) => p.id === projectIdNumber
    );
    setSelectedProject(currentProject);
  }, [projects, projectIdNumber]);

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
      <ProjectInfoSelector />
      <Outlet />
      <ProjectInfoNav />
    </ProjectInfoContext.Provider>
  );
}
