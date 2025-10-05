import ProjectInfoNav from './ProjectInfoNav';
import ProjectInfoSelector from './ProjectInfoSelector';
import { useProjectInfo } from '../contexts/useProjectInfo';

export function ProjectOverview() {
  const { selectedProject } = useProjectInfo();
  console.log(selectedProject);

  return (
    <>
      <ProjectInfoSelector />
      <div>{selectedProject?.name}</div>
      <div>{selectedProject?.description}</div>
      <div>{selectedProject?.status}</div>
      <ProjectInfoNav />
    </>
  );
}

export default ProjectOverview;
