import { useEffect, useState } from 'react';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  type: string;
}

function GetTicketsByUserId() {
  const [ticketData, setTicketData] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketsByUserId = async () => {
      try {
        const res = await fetch(
          'http://localhost:3000/api/tickets/assigneeId/1'
        );
        if (!res.ok) {
          throw new Error('Failed to fetch tickets');
        }
        const data = await res.json();
        setTicketData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchTicketsByUserId();
  }, []);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <ul>
        {ticketData.map((ticket) => (
          <li key={ticket.id}>
            {ticket.title} {ticket.description} {ticket.status}{' '}
            {ticket.priority} {ticket.type}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GetTicketsByUserId;
