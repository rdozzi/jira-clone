import { createContext } from 'react';
import { Tickets } from '../types/Tickets';

interface UserHomeTicketContextType {
  activeTickets: Tickets[];
  overDueTickets: Tickets[];
  upcomingDeadlines: Tickets[];
  recentActivity: { [key: string]: any }[];
  isFetchingTicketsById: boolean;
  ticketsByIdError: Error | null;
  isFetchingLogs: boolean;
  activityLogsError: Error | null;
}

export const UserHomeTicketContext = createContext<
  UserHomeTicketContextType | undefined
>(undefined);
