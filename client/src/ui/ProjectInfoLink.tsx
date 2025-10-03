import { NavLink } from 'react-router-dom';

function ProjectInfoLink({ projectId }: { projectId: number | undefined }) {
  return <NavLink to={`/projects/${projectId}/overview`}>Project Info</NavLink>;
}

export default ProjectInfoLink;
