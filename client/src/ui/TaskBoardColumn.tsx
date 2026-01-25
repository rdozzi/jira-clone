import { ConfigProvider } from 'antd';
import { Board } from '../pages/TaskBoard';
import { Ticket } from '../types/Ticket';
import TaskBoardCompContainer from './TaskBoardCompContainer';

export interface TaskBoardColumnProps {
  board: Board;
  tickets: Ticket[];
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
