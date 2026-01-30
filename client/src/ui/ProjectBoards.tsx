import { useProjectInfo } from '../contexts/useProjectInfo';
import { useGetBoardsByProjectId } from '../features/boards/useGetBoardsByProjectId';
import { useBoardModal } from '../contexts/modalContexts/useBoardModal';
import ProjectBoardsModal from './ProjectBoardsModal';

import { Spin, Table, Button } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import ProjectBoardListItemButton from './ProjectBoardListItemButton';

import { Board } from '../types/Board';

function ProjectBoards() {
  const { projectIdNumber } = useProjectInfo();
  const {
    isLoading: isBoardLoading,
    boards,
    error,
  } = useGetBoardsByProjectId(projectIdNumber);
  const { isOpen, openModal, closeModal, mode, modalProps } = useBoardModal();

  const record = modalProps.record as Board;

  if (isBoardLoading)
    return (
      <div>
        <Spin />
      </div>
    );
  if (error) return <div>Error Loading Projects!</div>;

  const columns: TableColumnsType<Board> = [
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
      render: (record) => <ProjectBoardListItemButton record={record} />,
    },
  ];

  function handleCreate() {
    openModal('create', {});
  }

  return (
    <>
      <Table<Board>
        columns={columns}
        dataSource={boards}
        rowKey='id'
        loading={isBoardLoading}
        pagination={false}
      />
      <div>
        <Button onClick={handleCreate}>
          <PlusOutlined /> Create
        </Button>
      </div>

      <ProjectBoardsModal
        isOpen={isOpen}
        closeModal={closeModal}
        mode={mode}
        record={record}
      />
    </>
  );
}

export default ProjectBoards;
