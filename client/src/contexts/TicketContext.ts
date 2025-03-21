import { createContext } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { Tickets } from '../types/ticket';

interface TicketContextType {
  tickets: Tickets[];
  isLoading: boolean;
  error: unknown;
  updateTicketMutation: UseMutationResult<any, unknown, any, unknown>;
}

export const TicketContext = createContext<TicketContextType | undefined>(
  undefined
);
