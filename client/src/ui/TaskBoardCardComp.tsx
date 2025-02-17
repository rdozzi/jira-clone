import { useState } from 'react';
import { Card } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

function openCreateTicketModal() {
  console.log('onCreateTicket button Pushed!');
}

function TaskBoardCardComp({ children, boardName }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Card
      bordered={false}
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexGrow: 1,
            fontWeight: 'bold',
          }}
        >
          {boardName}
        </div>
      }
      extra={
        isHovered && (
          <PlusCircleOutlined
            style={{
              fontSize: 20,
              cursor: 'pointer',
              color: 'blue', //Lighter shade#1890ff
              transition: 'color 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#40a9ff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'blue')} //#1890ff
            onClick={openCreateTicketModal}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openCreateTicketModal()}
            role='button'
            aria-label='Add new task'
          />
        )
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // style={{ position: 'relative' }} // Ensure proper layout behavior
    >
      {children}
    </Card>
  );
}

export default TaskBoardCardComp;
