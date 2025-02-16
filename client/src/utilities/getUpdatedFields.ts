// Function used to obtain the updated fields of a ticket form.

// interface Ticket {
//   assigneeId: number;
//   boardId: number;
//   createdAt: string;
//   description?: string;
//   dueDate?: string; // ISO 8601 format e.g., "2025-02-16T23:59:59Z"
//   id: number;
//   priority: 'LOW' | 'MEDIUM' | 'HIGH';
//   reporterId: number;
//   status: 'BACKLOG' | 'IN_PROGRESS' | 'CLOSED'; // Enum-like behavior for status
//   title: string;
//   type: 'BUG' | 'TASK' | 'STORY';
//   updatedAt: string;
// }

// interface UpdatedTicketFields {
//   title?: string;
//   description?: string;
//   boardId?: number;
//   reporterId?: number;
//   assigneeId?: number | null;
//   dueDate?: string;
//   status?: 'BACKLOG' | 'IN_PROGRESS' | 'CLOSED';
//   priority?: 'LOW' | 'MEDIUM' | 'HIGH';
//   type: 'BUG' | 'TASK' | 'STORY';
// }

function getUpdatedFields(ticketDbEntry, updatedValues) {
  console.log(ticketDbEntry);
  console.log(updatedValues);
  const updatedFields = {};
  for (const [key] of Object.entries(updatedValues)) {
    if (key in ticketDbEntry) {
      if (key === 'dueDate') {
        const dueDateDbEntry = ticketDbEntry.dueDate?.slice(0, 10);
        const dueDateUpdatedValues = updatedValues.dueDate?.slice(0, 10);
        if (dueDateDbEntry !== dueDateUpdatedValues) {
          updatedFields[key] = updatedValues[key];
        }
      } else if (updatedValues[key] !== ticketDbEntry[key]) {
        updatedFields[key] = updatedValues[key];
      }
    }
  }

  console.log(updatedFields);
  return updatedFields;
}

export default getUpdatedFields;
