import { useState, useEffect } from 'react';
import { useGetTickets } from '../features/tickets/useGetTickets';
import { Calendar, Badge } from 'antd';
import dayjs from 'dayjs';

// const events = [
//   { id: 1, title: 'Ticket1', date: '2024-12-30', status: 'Completed' },
//   { id: 2, title: 'Ticket2', date: '2024-12-31', status: 'In Progress' },
// ];

function TaskCalender() {
  const { isLoading, tickets, error } = useGetTickets();
  const [ticketState, setTicketState] = useState([]);
  useEffect(() => {
    if (tickets) {
      const formattedTickets = tickets.map((ticket) => ({
        ...ticket,
        dueDate: dayjs(ticket.dueDate).format('YYYY-MM-DD'),
      }));
      setTicketState(formattedTickets);
    }
  }, [tickets]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function cellRender(date, info) {
    if (info.type === 'date') {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const ticketsForDate = ticketState.filter(
        (ticket) => ticket.dueDate === formattedDate
      );

      return (
        <ul>
          {ticketsForDate.map((ticket) => (
            <li key={ticket.id}>
              <Badge status='success' text={ticket.title} />
            </li>
          ))}
        </ul>
      );
    } else {
      return null;
    }
  }

  return <Calendar cellRender={cellRender} />;
}
export default TaskCalender;
