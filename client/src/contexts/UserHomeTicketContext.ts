import { createContext } from 'react';
import { Ticket } from '../types/Ticket';

interface UserHomeTicketContextType {
  activeTickets: Ticket[];
  overDueTickets: Ticket[];
  upcomingDeadlines: Ticket[];
  recentActivity: { [key: string]: any }[];
  isFetchingTicketsById: boolean;
  ticketsByIdError: Error | null;
  isFetchingLogs: boolean;
  activityLogsError: Error | null;
}

export const UserHomeTicketContext = createContext<
  UserHomeTicketContextType | undefined
>(undefined);
