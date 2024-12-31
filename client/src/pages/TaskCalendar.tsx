import { useGetTickets } from '../features/tickets/useGetTickets';
import { Calendar, Badge } from 'antd';
import dayjs from 'dayjs';

const events = [
  { id: 1, title: 'Ticket1', date: '2024-12-30', status: 'Completed' },
  { id: 2, title: 'Ticket2', date: '2024-12-31', status: 'In Progress' },
];

function TaskCalender() {
  const { isLoading, tickets, error } = useGetTickets();

  function cellRender(date, info) {
    if (info.type === 'date') {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      console.log(formattedDate);
      const dayEvents = events.filter((event) => event.date === formattedDate);

      return (
        <ul>
          {dayEvents.map((tickets) => (
            <li key={tickets.id}>
              <Badge status='success' text={tickets.title} />
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
