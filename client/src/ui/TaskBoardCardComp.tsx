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
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: '100%',
          }}
        >
          <span style={{ fontWeight: 'bold' }}>{boardName}</span>

          <span
            style={{
              position: 'absolute',
              right: 0,
              transition: 'opacity 0.2s ease-in-out',
              opacity: isHovered ? 1 : 0,
              cursor: 'pointer',
            }}
            onClick={openCreateTicketModal}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#40a9ff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'blue')} //#1890ff
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openCreateTicketModal()}
            role='button'
            aria-label='Add new task'
          >
            {/* style={{ width: 24, textAlign: 'right' }} */}
            <PlusCircleOutlined
              style={{
                fontSize: 20,
                color: 'blue', //Lighter shade#1890ff
              }}
            />
          </span>
        </div>
      }
      style={{ position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Card>
  );
}

export default TaskBoardCardComp;
