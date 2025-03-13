import { ConfigProvider } from 'antd';
import { Board, Tickets } from '../pages/TaskBoard';
import TaskBoardCompContainer from './TaskBoardCompContainer';

export interface TaskBoardColumnProps {
  board: Board;
  tickets: Tickets[];
  openCreateTicketModal: () => void;
}

function TaskBoardColumn({
  board,
  tickets,
  openCreateTicketModal,
}: TaskBoardColumnProps) {
  return (
    <ConfigProvider>
      <div
        style={{
          width: '300px',
          minHeight: '500px',
          textAlign: 'center',
          flexShrink: 0,
        }}
      >
        <TaskBoardCompContainer
          board={board}
          tickets={tickets || []}
          openCreateTicketModal={openCreateTicketModal}
        />
      </div>
    </ConfigProvider>
  );
}

export default TaskBoardColumn;
