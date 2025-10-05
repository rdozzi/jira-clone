import { useProjectMembers } from '../contexts/useProjectMembers';
import { Spin } from 'antd';

function ProjectMembers() {
  const { projectMembers, isLoadingProjectMember, error } = useProjectMembers();

  if (isLoadingProjectMember)
    return (
      <div>
        <Spin />
      </div>
    );
  if (error) return <div>Error Loading Projects!</div>;

  return (
    <>
      <div>Project Members!</div>
      <div>
        {projectMembers?.map((projectMember) => (
          <div key={projectMember.userId}>
            <div>
              Name: {projectMember.firstName} {projectMember.lastName}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProjectMembers;
