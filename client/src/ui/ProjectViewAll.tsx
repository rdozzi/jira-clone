import Loading from './Loading';
import ProjectViewAllModal from './ProjectViewAllModal';
import ProjectViewAllItemButton from './ProjectViewAllItemButton';
import BackButton from './BackButton';

import { Table, Button } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useGetProjects } from '../features/projects/useGetProjects';
import { useProjectModal } from '../contexts/modalContexts/useProjectModal';
import { ProjectViewAllProjects } from '../types/Project';

function ProjectViewAll() {
  const {
    isLoading: isProjectsLoading,
    projects,
    error,
  } = useGetProjects('info');
  const { isOpen, openModal, closeModal, mode, modalProps } = useProjectModal();

  const record = modalProps.record;

  if (isProjectsLoading) return <Loading />;
  if (error) return <div>Error loading Projects!</div>;

  const columns: TableColumnsType<ProjectViewAllProjects> = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (value) => {
        const strLength = value.length;
        const slice = value.slice(1, strLength);
        const lwrCaseSlice = slice.toLowerCase();
        const finalString = value.charAt(0) + lwrCaseSlice;
        return finalString;
      },
    },
    {
      title: 'Is Project Public?',
      dataIndex: 'isPublic',
      render: (value) => {
        if (value) {
          return 'Yes';
        } else {
          return 'No';
        }
      },
      sorter: {
        compare: (a, b) => Number(b.isPublic) - Number(a.isPublic),
      },
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'lastName',
      sorter: (a, b) => a.owner.lastName.localeCompare(b.owner.lastName),
      render: (owner) => {
        return owner.firstName + ' ' + owner.lastName;
      },
    },
    {
      title: '',
      key: 'action',
      align: 'center',
      render: (record) => <ProjectViewAllItemButton record={record} />,
    },
  ];

  function handleCreate() {
    openModal('create', {});
  }

  return (
    <>
      <Table<ProjectViewAllProjects>
        columns={columns}
        dataSource={projects}
        rowKey='id'
        loading={isProjectsLoading}
        pagination={false}
      />
      <div>
        <Button onClick={handleCreate}>
          <PlusOutlined /> Create
        </Button>
      </div>

      <ProjectViewAllModal
        isOpen={isOpen}
        closeModal={closeModal}
        mode={mode}
        record={record}
      />
      <BackButton />
    </>
  );
}

export default ProjectViewAll;
