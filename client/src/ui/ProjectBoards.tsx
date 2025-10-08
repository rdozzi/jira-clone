import { useProjectInfo } from '../contexts/useProjectInfo';
import { useGetBoardsByProjectId } from '../features/boards/useGetBoardsByProjectId';
import { useModal } from '../contexts/useModal';
import ProjectBoardsModal from './ProjectBoardsModal';

import { Spin, Table, Button } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import BoardListItemButton from './BoardListItemButton';

import { Boards } from '../types/Boards';

const onChange: TableProps<Boards>['onChange'] = (
  pagination,
  filters,
  sorter,
  extra
) => console.log('params', pagination, filters, sorter, extra);

function ProjectBoards() {
  const { projectIdNumber } = useProjectInfo();
  const {
    isLoading: isBoardLoading,
    boards,
    error,
  } = useGetBoardsByProjectId(projectIdNumber);
  const { isOpen, openModal, closeModal, mode, modalProps } = useModal();

  if (isBoardLoading)
    return (
      <div>
        <Spin />
      </div>
    );
  if (error) return <div>Error Loading Projects!</div>;

  const columns: TableColumnsType<Boards> = [
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
      title: '',
      key: 'action',
      align: 'center',
      render: (record) => <BoardListItemButton record={record} />,
    },
  ];

  function handleCreate() {
    openModal('create', {});
  }

  return (
    <>
      <Table<Boards>
        columns={columns}
        dataSource={boards}
        rowKey='id'
        onChange={onChange}
        loading={isBoardLoading}
        pagination={false}
      />
      <div>
        <Button onClick={handleCreate}>
          <PlusOutlined /> Create
        </Button>
      </div>
      {mode === 'create' && (
        <ProjectBoardsModal
          isOpen={isOpen}
          closeModal={closeModal}
          mode={mode}
          {...modalProps}
        />
      )}
    </>
  );
}

export default ProjectBoards;
