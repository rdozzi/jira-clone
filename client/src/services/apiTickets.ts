interface Ticket {
  assigneeId: number;
  boardId: number;
  description: string;
  dueDate: string;
  priority: string;
  reporterId: number;
  status: string;
  title: string;
  type: string;
}

export async function getTickets() {
  try {
    const res = await fetch('http://localhost:3000/api/tickets');
    if (!res.ok) {
      throw new Error('Failed to fetch tickets');
    }
    const data = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function createTicket(ticket: Ticket) {
  try {
    const res = await fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket),
    });
    if (!res.ok) {
      throw new Error('Failed to create ticket');
    }
    const data = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}
