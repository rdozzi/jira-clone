import { memo, forwardRef } from 'react';

import { Card } from 'antd';
import TicketListItemButton from './TicketListItemButton';

const TaskBoardTicketCardComp = memo(
  forwardRef(function TaskBoardTicketCardComp(
    {
      draggableProps,
      dragHandleProps,
      ticket, //Individual ticket information
      children,
    },
    ref
  ) {
    return (
      <Card
        {...draggableProps}
        {...dragHandleProps}
        ref={ref}
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
  }),

  arePropsEqual
);

function arePropsEqual(prevProps, nextProps) {
  return prevProps.ticket === nextProps.ticket;
}

export default TaskBoardTicketCardComp;
