import { Record } from '../ui/TicketListItemButton';
import TaskCalendarTicketItem from './TaskCalendarTicketItem';

type CellRenderRecord = Record;

function TaskCalendarTicketList({ tickets }) {
  return (
    <ul style={{ listStyleType: 'none', padding: '0' }}>
      {tickets.map((ticket: CellRenderRecord) => (
        <TaskCalendarTicketItem key={ticket.id} record={ticket} />
      ))}
    </ul>
  );
}

export default TaskCalendarTicketList;
