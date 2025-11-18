import { NavLink } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useProjectInfo } from '../contexts/useProjectInfo';

function ProjectInfoLink() {
  const { projectIdNumber } = useProjectInfo();
  return (
    <>
      <InfoCircleOutlined />
      <NavLink to={`/projects/${projectIdNumber}/overview`}>
        Project Info
      </NavLink>
    </>
  );
}

export default ProjectInfoLink;
