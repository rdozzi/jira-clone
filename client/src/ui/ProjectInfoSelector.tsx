import { useLocation, useNavigate } from 'react-router-dom';
import { useProjectInfo } from '../contexts/useProjectInfo';
import { Select, Flex } from 'antd';
import { useUser } from '../contexts/useUser';
import { NavLink } from 'react-router-dom';

function ProjectInfoSelector() {
  const {
    selectedProject,
    setSelectedProject,
    isProjectLoading,
    typedProjects,
  } = useProjectInfo();
  const { userSelf } = useUser();

  const navigate = useNavigate();
  const location = useLocation();

  function onChange(value: number | null | undefined) {
    const selectedProject = typedProjects?.find((p) => p.id === value) || null;
    setSelectedProject(selectedProject);

    const updatedPath = location.pathname.replace(
      /\/projects\/\d+/,
      `/projects/${selectedProject!.id}`
    );

    navigate(updatedPath, { replace: true });
  }

  return (
    <Flex gap='middle' align='center'>
      <Select
        value={selectedProject?.id}
        loading={isProjectLoading}
        size={'middle'}
        onChange={onChange}
      >
        {typedProjects?.map((project) => {
          return (
            <Select.Option key={project.id} value={project.id}>
              {project.name}
            </Select.Option>
          );
        })}
      </Select>
      <div>{selectedProject?.name}</div>
      <div>{selectedProject?.description}</div>
      <div>{selectedProject?.status}</div>
      {userSelf?.organizationRole === 'ADMIN' ||
      userSelf?.organizationRole === 'SUPERADMIN' ? (
        <>
          <span> | </span>
          <NavLink to={`/projects/view-all`}>View All Projects</NavLink>
        </>
      ) : (
        ''
      )}
    </Flex>
  );
}

export default ProjectInfoSelector;
