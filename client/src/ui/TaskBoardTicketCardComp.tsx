import { memo } from 'react';

import { Card } from 'antd';
import TicketListItemButton from './TicketListItemButton';

const TaskBoardTicketCardComp = memo(function TaskBoardTicketCardComp({
  draggableProps,
  dragHandleProps,
  innerRef,
  ticket, //Individual ticket information
  children,
}) {
  return (
    <Card
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      bordered={false}
      size='small'
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
          <span style={{ fontWeight: 'bold' }}>{ticket.title}</span>
          <span
            style={{
              position: 'absolute',
              right: 0,
              cursor: 'pointer',
            }}
          >
            <TicketListItemButton record={ticket} />
          </span>
        </div>
      }
    >
      {children}
    </Card>
  );
});

export default TaskBoardTicketCardComp;
