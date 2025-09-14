import { createContext } from 'react';
import { UseMutateFunction } from '@tanstack/react-query';
import { Tickets } from '../types/Tickets';

interface TicketContextType {
  tickets: Tickets[];
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
  undefined
);
