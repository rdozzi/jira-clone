import { useProjectInfo } from '../contexts/useProjectInfo';
import { useGetUsersByProjectId } from '../features/users/useGetUsersByProjectId';
import { Spin } from 'antd';
import { Users } from '../types/Users';

function ProjectMembers() {
  const { projectIdNumber } = useProjectInfo();
  const { isLoadingUsers, projectUsers, error } =
    useGetUsersByProjectId(projectIdNumber);

  if (isLoadingUsers)
    return (
      <p>
        <Spin />
      </p>
    );
  if (error) return <p>Error Loading Projects!</p>;

  return (
    <>
      <div>Project Members!</div>
      <div>
        {projectUsers?.map((projectUser: Users) => (
          <>
            <div key={projectUser.id}>
              <div>
                Name: {projectUser.firstName} {projectUser.lastName}
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}

export default ProjectMembers;
