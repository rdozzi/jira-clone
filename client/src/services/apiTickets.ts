import { getAuthToken } from '../lib/getAuthToken';
import { Ticket, TicketDTO } from '../types/Ticket';

export async function getTickets() {
  try {
    const token = getAuthToken();
    const res = await fetch('http://localhost:3000/api/tickets', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch tickets');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function getTicketsByAssigneeId(userId: number | undefined) {
  try {
    const token = getAuthToken();
    const res = await fetch(
      `http://localhost:3000/api/tickets/${userId}/assigneeId`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error:', res.status, res.statusText, errorText);
      throw new Error('Failed to add project member');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function getTicketsByBoardId(boardId: number) {
  try {
    const token = getAuthToken();
    const res = await fetch(
      `http://localhost:3000/api/tickets/${boardId}/board`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (!res.ok) {
      throw new Error('Failed to fetch tickets');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function getTicketById(ticketId: number) {
  try {
    const token = getAuthToken();
    const res = await fetch(`http://localhost:3000/api/tickets/${ticketId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch ticket');
    }
    const data = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}

export async function createTicket(ticket: Partial<TicketDTO>) {
  try {
    console.log(ticket);
    const token = getAuthToken();
    const res = await fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
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
    const token = getAuthToken();
    const res = await fetch(`http://localhost:3000/api/tickets/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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

export async function updateTicket(ticketId: number, ticket: Partial<Ticket>) {
  try {
    const token = getAuthToken();
    const res = await fetch(
      `http://localhost:3000/api/tickets/${ticketId}/update`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      },
    );
    if (!res.ok) {
      throw new Error('Failed to update ticket');
    }
    const { data } = await res.json();
    return data;
  } catch (err: any | unknown) {
    console.error(err);
  }
}
