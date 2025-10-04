import { Select } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProjects } from '../features/projects/useGetProjects';
import { Projects } from '../types/Projects';
import ProjectInfoNav from './ProjectInfoNav';

function ProjectOverview() {
  const { projectId } = useParams();
  const {
    projects,
    isLoading: isProjectLoading,
    // error: projectError,
  } = useGetProjects();

  const projectIdNumber = Number(projectId);

  const currentProject: Projects = projects?.find(
    (p: Projects) => p.id === projectIdNumber
  );

  const [selectedProject, setSelectedProject] = useState<Projects | null>(
    currentProject
  );

  const typedProjects = (projects as Projects[]) || null;

  return (
    <>
      <div>
        <Select
          value={selectedProject?.name}
          loading={isProjectLoading}
          size={'middle'}
          onChange={() => {
            const selectedProject =
              typedProjects?.find((p) => p.id === projectIdNumber) || null;
            setSelectedProject(selectedProject);
          }}
        >
          {typedProjects?.map((project) => {
            return (
              <Select.Option key={project.id} value={project.id}>
                {project.name}
              </Select.Option>
            );
          })}
        </Select>
      </div>
      <div>{selectedProject?.name}</div>
      <div>{selectedProject?.description}</div>
      <div>{selectedProject?.status}</div>
      <ProjectInfoNav />
    </>
  );
}

export default ProjectOverview;
