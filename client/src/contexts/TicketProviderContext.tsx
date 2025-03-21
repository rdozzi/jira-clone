import { useGetTickets } from '../features/tickets/useGetTickets';
import { useUpdateTicket } from '../features/tickets/useUpdateTicket';
import { TicketContext } from './TicketContext';

type TicketProviderProps = { children: React.ReactNode };

export const TicketProviderContext = ({ children }: TicketProviderProps) => {
  const { tickets, isLoading, error } = useGetTickets();
  const updateTicketMutation = useUpdateTicket();

  return (
    <TicketContext.Provider
      value={{ tickets, isLoading, error, updateTicketMutation }}
    >
      {children}
    </TicketContext.Provider>
  );
};
