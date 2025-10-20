import { NavLink } from 'react-router-dom';
import { useProjectInfo } from '../contexts/useProjectInfo';

function ProjectInfoLink() {
  const { projectIdNumber } = useProjectInfo();
  return (
    <NavLink to={`/projects/${projectIdNumber}/overview`}>Project Info</NavLink>
  );
}

export default ProjectInfoLink;
