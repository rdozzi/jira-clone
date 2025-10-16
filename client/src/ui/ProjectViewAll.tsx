import Loading from './Loading';
import ProjectViewAllModal from './ProjectViewAllModal';
import ProjectViewAllItemButton from './ProjectViewAllItemButton';

import { Table, Button } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useModal } from '../contexts/useModal';
import { useGetProjects } from '../features/projects/useGetProjects';
import { Projects } from '../types/Projects';

const onChange: TableProps<ProjectViewAllProjects>['onChange'] = (
  pagination,
  filters,
  sorter,
  extra
) => console.log('params', pagination, filters, sorter, extra);

export interface ProjectViewAllProjects extends Projects {
  owner: any;
}

function ProjectViewAll() {
  const { isLoading: isProjectsLoading, projects, error } = useGetProjects();
  const { isOpen, openModal, closeModal, mode, modalProps } = useModal();

  const record = modalProps.record as ProjectViewAllProjects;

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
        onChange={onChange}
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
    </>
  );
}

export default ProjectViewAll;
