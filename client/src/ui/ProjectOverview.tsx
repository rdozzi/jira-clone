import { Select } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProjects } from '../features/projects/useGetProjects';
import { Projects } from '../types/Projects';

function ProjectOverview() {
  const { projectId } = useParams();
  const [selectedProject, setSelectedProject] = useState<Projects | null>();
  const {
    projects,
    isLoading: isProjectLoading,
    // error: projectError,
  } = useGetProjects();

  const typedProjects = (projects as Projects[]) || null;
  const projectIdNumber = Number(projectId);
  console.log(typedProjects);

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
    </>
  );
}

export default ProjectOverview;
