import { memo } from 'react';
import { Card } from 'antd';
import TicketListItemButton from './TicketListItemButton';

interface TaskBoardTicketCardCompProps {
  ticket: {
    assignee: { first_name: string; last_name: string };
    assigneeId: number;
    boardId: number;
    createdAt: Date;
    description: string;
    dueDate: Date;
    id: number;
    priority: string;
    reporterId: number;
    status: string;
    title: string;
    type: string;
    updatedAt: Date;
  };
}

const TaskBoardTicketCardComp = memo(function TaskBoardTicketCardComp({
  ticket, //Individual ticket information
}: TaskBoardTicketCardCompProps) {
  return (
    <Card
      bordered={false}
      size='small'
      style={{
        willChange: 'transform',
        transition: 'transform 0.2s ease-in-out',
      }}
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
      <p>{ticket.description}</p>
    </Card>
  );
}, arePropsEqual);

function arePropsEqual(
  prevProps: TaskBoardTicketCardCompProps,
  nextProps: TaskBoardTicketCardCompProps
): boolean {
  return (
    prevProps.ticket.title === nextProps.ticket.title &&
    prevProps.ticket.description === nextProps.ticket.description
  );
}

export default TaskBoardTicketCardComp;
