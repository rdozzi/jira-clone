import TaskCalendarTicketItem from './TaskCalendarTicketItem';
import { Ticket } from '../types/Ticket';

type CalendarTicket = Omit<Ticket, 'dueDate'> & { dueDate: string };

function TaskCalendarTicketList({ tickets }: { tickets: CalendarTicket[] }) {
  return (
    <ul style={{ listStyleType: 'none', padding: '0' }}>
      {tickets.map((ticket: CalendarTicket) => (
        <TaskCalendarTicketItem key={ticket.id} record={ticket} />
      ))}
    </ul>
  );
}

export default TaskCalendarTicketList;
