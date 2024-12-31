interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
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
