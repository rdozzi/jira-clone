import { useProjectMembers } from '../contexts/useProjectMembers';
import { useProjectInfo } from '../contexts/useProjectInfo';
import { Spin, Table, Button } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { ProjectMember } from '../types/ProjectMember';
import { useProjectMemberModal } from '../contexts/modalContexts/useProjectMemberModal';

import ProjectMemberListItemButton from './ProjectMemberListItemButton';
import ProjectMembersModal from './ProjectMembersModal';

function ProjectMembers() {
  const { projectMembers, isLoadingProjectMember, error } = useProjectMembers();
  const { projectIdNumber } = useProjectInfo();
  const { isOpen, openModal, closeModal, mode, modalProps } =
    useProjectMemberModal();

  if (isLoadingProjectMember)
    return (
      <div>
        <Spin />
      </div>
    );
  if (error) return <div>Error Loading Project Members!</div>;

  const columns: TableColumnsType<ProjectMember> = [
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: any) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) =>
        a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase()),
    },
    {
      title: 'Project Role',
      dataIndex: 'projectRole',
      sorter: (a, b) => a.projectRole.localeCompare(b.projectRole),
    },
    {
      title: '',
      key: 'action',
      align: 'center',
      render: (record) => (
        <ProjectMemberListItemButton
          record={record}
          projectId={projectIdNumber}
        />
      ),
    },
  ];

  function handleCreate() {
    openModal('create', {});
  }

  return (
    <>
      <Table<ProjectMember>
        columns={columns}
        dataSource={projectMembers}
        rowKey='userId'
        loading={isLoadingProjectMember}
        pagination={false}
      />
      <div>
        <Button onClick={handleCreate}>
          <PlusOutlined /> Add
        </Button>
      </div>
      <ProjectMembersModal
        isOpen={isOpen}
        closeModal={closeModal}
        mode={mode}
        {...modalProps}
      />
    </>
  );
}

export default ProjectMembers;
