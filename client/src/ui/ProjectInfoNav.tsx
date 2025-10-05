import { NavLink, useParams } from 'react-router-dom';

function ProjectInfoNav() {
  const { projectId } = useParams();
  return (
    <>
      <div>
        <NavLink to={`/projects/${projectId}/overview`}>Project Info</NavLink>
      </div>
      <div>
        <NavLink to={`/projects/${projectId}/boards`}>Project Boards</NavLink>
      </div>
      <div>
        <NavLink to={`/projects/${projectId}/members`}>Project Members</NavLink>
      </div>
    </>
  );
}

export default ProjectInfoNav;
