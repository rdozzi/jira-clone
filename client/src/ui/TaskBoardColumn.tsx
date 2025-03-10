import { ConfigProvider } from 'antd';
import TaskBoardTicketList from './TaskBoardTicketList';
import TaskBoardCardComp from './TaskBoardCardComp';

function TaskBoardColumn({ board, tickets, openCreateTicketModal }) {
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
        <TaskBoardTicketList
          board={board}
          tickets={tickets || []}
          openCreateTicketModal={openCreateTicketModal}
        />
      </div>
    </ConfigProvider>
  );
}

export default TaskBoardColumn;
