import { useRef } from 'react';
import { Card } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

interface TaskBoardCardCompProps {
  children: React.ReactNode;
  boardName: string;
  openCreateTicketModal: () => void;
}

function TaskBoardCardComp({
  children,
  boardName,
  openCreateTicketModal,
}: TaskBoardCardCompProps) {
  const iconRef = useRef<HTMLElement | null>(null);
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
              opacity: 1,
              cursor: 'pointer',
            }}
            onClick={openCreateTicketModal}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openCreateTicketModal()}
            role='button'
            aria-label='Add new task'
          >
            {/* style={{ width: 24, textAlign: 'right' }} */}
            <PlusCircleOutlined
              ref={iconRef}
              style={{
                fontSize: 20,
                color: 'blue', //Lighter shade#1890ff
                opacity: 0,
                transition: 'opacity 0.2s ease-in-out',
              }}
            />
          </span>
        </div>
      }
      style={{
        position: 'relative',

        transition: 'height 0.7s ease-in-out, min-height 0.7s ease-in-out', // Always animate
        minHeight: '300px',
      }}
      onMouseEnter={() => {
        if (iconRef.current) {
          iconRef.current.style.opacity = '1';
        }
      }}
      onMouseLeave={() => {
        if (iconRef.current) {
          iconRef.current.style.opacity = '0';
        }
      }}
    >
      {children}
    </Card>
  );
}

export default TaskBoardCardComp;
