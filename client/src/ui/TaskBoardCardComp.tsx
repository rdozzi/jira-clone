import { useRef } from 'react';
import { Card } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

function TaskBoardCardComp({
  children,
  boardName,
  openCreateTicketModal,
  innerRef,
}) {
  const iconRef = useRef(null);
  console.log(iconRef);
  return (
    <Card
      bordered={false}
      ref={innerRef} // Required for @pangea/dnd
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
      style={{ position: 'relative' }}
      onMouseEnter={() => (iconRef.current.style.opacity = 1)}
      onMouseLeave={() => (iconRef.current.style.opacity = 0)}
    >
      {children}
    </Card>
  );
}

export default TaskBoardCardComp;
