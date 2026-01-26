import { Popover, Descriptions } from 'antd';
import { Ticket } from '../types/Ticket';
import TicketListItemButton from './TicketListItemButton';
import { useTheme } from '../contexts/useTheme';

type CalendarTicket = Omit<Ticket, 'dueDate'> & { dueDate: string };

// "record" is used in place of "ticket"
function TaskCalendarCellRender({ record }: { record: CalendarTicket }) {
  const { modeTheme } = useTheme();

  const content = (
    <Descriptions
      size='small'
      column={1}
      style={{
        maxWidth: 250,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      <Descriptions.Item label='Title'>
        {record.title || 'NA'}
      </Descriptions.Item>
      <Descriptions.Item label='Description'>
        {record.description || '—'}
      </Descriptions.Item>
      <Descriptions.Item label='Status'>{record.status}</Descriptions.Item>
      <Descriptions.Item label='Due Date'>
        {typeof record.dueDate === 'string' && record.dueDate}
      </Descriptions.Item>
    </Descriptions>
  );
  return (
    <li
      key={record.id}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '2px 0',
      }}
    >
      <Popover
        title={'Ticket Info'}
        content={content}
        placement='right'
        trigger='hover'
      >
        <span
          style={{
            flex: 1,
            padding: '2px 8px',
            borderRadius: '5px',
            backgroundColor:
              modeTheme === 'light'
                ? 'var(--ticket-bg, #DADADA)'
                : 'var(--ticket-bg, #4c4c4c)',
            fontSize: '12px',
            lineHeight: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={record.title}
        >
          {record.title}
        </span>
      </Popover>
      <span style={{ marginLeft: '5px', marginRight: '5px' }}>
        <TicketListItemButton record={record} />
      </span>
    </li>
  );
}

export default TaskCalendarCellRender;
