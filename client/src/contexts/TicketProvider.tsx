import { useGetTicketsByBoardId } from '../features/tickets/useGetTicketsByBoardId';
import { useUpdateTicket } from '../features/tickets/useUpdateTicket';
import { TicketContext } from './TicketContext';
import { useProjectBoard } from './useProjectBoard';

type TicketProviderProps = { children: React.ReactNode };

export const TicketProvider = ({ children }: TicketProviderProps) => {
  const { boardId } = useProjectBoard();
  const { tickets, isLoading, error } = useGetTicketsByBoardId(boardId);
  const updateTicketMutation = useUpdateTicket();

  return (
    <TicketContext.Provider
      value={{ tickets, isLoading, error, updateTicketMutation }}
    >
      {children}
    </TicketContext.Provider>
  );
};
