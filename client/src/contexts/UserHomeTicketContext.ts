import { createContext } from 'react';
import { Tickets } from '../types/Tickets';
import { ActivityLogs } from '../types/ActivityLogs';

interface UserHomeTicketContextType {
  activeTickets: Tickets[];
  overDueTickets: Tickets[];
  upcomingDeadlines: Tickets[];
  recentActivity: ActivityLogs[];
  isFetchingTicketsById: boolean;
  ticketsByIdError: Error | null;
  isFetchingLogs: boolean;
  activityLogsError: Error | null;
}

export const UserHomeTicketContext = createContext<
  UserHomeTicketContextType | undefined
>(undefined);
