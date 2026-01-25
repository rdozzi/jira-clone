import { createContext } from 'react';
import { UseMutateFunction } from '@tanstack/react-query';
import { Ticket } from '../types/Ticket';

interface TicketContextType {
  tickets: Ticket[];
  isLoading: boolean;
  error: Error | null;
  updateTicketMutation: {
    updateTicket: UseMutateFunction<
      any,
      Error,
      { ticketId: number; values: any }
    >;
    isUpdating: boolean;
  };
}

export const TicketContext = createContext<TicketContextType | undefined>(
  undefined,
);
