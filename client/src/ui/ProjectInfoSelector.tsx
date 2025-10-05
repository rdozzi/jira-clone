import { useProjectInfo } from '../contexts/useProjectInfo';
import { Select } from 'antd';

function ProjectInfoSelector() {
  const {
    selectedProject,
    setSelectedProject,
    isProjectLoading,
    typedProjects,
    projectIdNumber,
  } = useProjectInfo();
  return (
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
  );
}

export default ProjectInfoSelector;
