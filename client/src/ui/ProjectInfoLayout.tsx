import { Outlet } from 'react-router-dom';
import ProjectInfoSelector from './ProjectInfoSelector';
import ProjectInfoNav from './ProjectInfoNav';

function ProjectInfoLayout() {
  return (
    <>
      <ProjectInfoSelector />
      <Outlet />
      <ProjectInfoNav />
    </>
  );
}

export default ProjectInfoLayout;
