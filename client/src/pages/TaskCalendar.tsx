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
      setTicketState(() => tickets);
    }
  }, [tickets]);

  console.log(ticketState);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function cellRender(date, info) {
    if (info.type === 'date') {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const activeTickets = ticketState.filter(
        (ticket) => dayjs(ticket.dueDate).format('YYYY-MM-DD') === formattedDate
      );
      console.log(activeTickets);

      return (
        <ul>
          {activeTickets.map((activeTicket) => (
            <li key={activeTicket.id}>
              <Badge status='success' text={activeTicket.title} />
            </li>
          ))}
        </ul>
      );
    }
    return null;
  }

  return <Calendar cellRender={cellRender} />;
}
export default TaskCalender;
