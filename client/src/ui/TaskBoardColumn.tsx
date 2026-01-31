import { ConfigProvider } from 'antd';
import { Ticket } from '../types/Ticket';
import TaskBoardCompContainer from './TaskBoardCompContainer';
import { StaticTaskBoards } from '../pages/TaskBoard';

export interface TaskBoardColumnProps {
  board: StaticTaskBoards;
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
