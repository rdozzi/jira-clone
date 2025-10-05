import { useProjectInfo } from '../contexts/useProjectInfo';

export function ProjectOverview() {
  const { selectedProject } = useProjectInfo();
  console.log(selectedProject);

  return (
    <>
      <div>{selectedProject?.name}</div>
      <div>{selectedProject?.description}</div>
      <div>{selectedProject?.status}</div>
    </>
  );
}

export default ProjectOverview;
