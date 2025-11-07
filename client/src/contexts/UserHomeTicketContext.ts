import { createContext } from 'react';
import { Tickets } from '../types/Tickets';

interface UserHomeTicketContextType {
  activeTickets: Tickets[];
  overDueTickets: Tickets[];
  upcomingDeadlines: Tickets[];
  isFetchingTicketsById: boolean;
  ticketsByIdError: Error | null;
}

export const UserHomeTicketContext = createContext<
  UserHomeTicketContextType | undefined
>(undefined);
