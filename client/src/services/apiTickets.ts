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

type UpdatedTicket = Partial<Ticket>;

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

export async function getTicketById(id: number) {
  try {
    const res = await fetch(`http://localhost:3000/api/tickets/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch ticket');
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

export async function deleteTicket(id: number) {
  try {
    const res = await fetch(`http://localhost:3000/api/tickets/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete ticket');
    }
    const data = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function updateTicket(id: number, ticket: UpdatedTicket) {
  try {
    const res = await fetch(`http://localhost:3000/api/tickets/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket),
    });
    if (!res.ok) {
      throw new Error('Failed to update ticket');
    }
    const data = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}
