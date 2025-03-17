import { Record } from './TicketListItemButton';
import TicketListItemButton from './TicketListItemButton';

type CellRenderRecord = Record;

// "record" is used in place of "ticket"
function TaskCalendarCellRender({ record }: { record: CellRenderRecord }) {
  return (
    <li
      key={record.id}
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          margin: '1px',
          padding: '2px 5px 2px 5px',
          maxWidth: '100px',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          backgroundColor: '#ADD8E6',
          textAlign: 'center',
        }}
      >
        {record.title}
      </span>
      <span style={{ marginLeft: '5px', marginRight: '5px' }}>
        <TicketListItemButton record={record} />
      </span>
    </li>
  );
}

export default TaskCalendarCellRender;
