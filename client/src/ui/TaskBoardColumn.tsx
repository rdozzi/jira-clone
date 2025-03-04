import { ConfigProvider } from 'antd';
import TaskBoardTicketList from './TaskBoardTicketList';
import TaskBoardCardComp from './TaskBoardCardComp';

function TaskBoardColumn({ board, boardState, openCreateTicketModal }) {
  return (
    <ConfigProvider>
      <div style={{ width: '300px', textAlign: 'center' }}>
        <TaskBoardTicketList
          board={board}
          tickets={boardState[board.id] || []}
          openCreateTicketModal={openCreateTicketModal}
        />
      </div>
    </ConfigProvider>
  );
}

export default TaskBoardColumn;
