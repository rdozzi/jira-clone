import { useProjectMembers } from '../contexts/useProjectMembers';
import { useProjectInfo } from '../contexts/useProjectInfo';
import { Spin, Table, Button } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { ProjectMember } from '../types/ProjectMember';
import { useModal } from '../contexts/useModal';

import ProjectListItemButton from './ProjectListItemButton';
import ProjectMembersModal from './ProjectMembersModal';

const onChange: TableProps<ProjectMember>['onChange'] = (
  pagination,
  filters,
  sorter,
  extra
) => console.log('params', pagination, filters, sorter, extra);

function ProjectMembers() {
  const { projectMembers, isLoadingProjectMember, error } = useProjectMembers();
  const { projectIdNumber } = useProjectInfo();
  const { isOpen, openModal, closeModal, mode, modalProps } = useModal();

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
      title: 'Role',
      dataIndex: 'projectRole',
      sorter: (a, b) => a.projectRole.localeCompare(b.projectRole),
    },
    {
      title: '',
      key: 'action',
      align: 'center',
      render: (record) => <ProjectListItemButton record={record} />,
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
        onChange={onChange}
        loading={isLoadingProjectMember}
        pagination={false}
      />
      <div>
        <Button onClick={handleCreate}>
          <PlusOutlined /> Create
        </Button>
      </div>
      {mode === 'create' && (
        <ProjectMembersModal
          isOpen={isOpen}
          closeModal={closeModal}
          mode={mode}
          {...modalProps}
        />
      )}
    </>
  );
}

export default ProjectMembers;
