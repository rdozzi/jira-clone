import { TicketContext } from './TicketContext';
import { useContext } from 'react';

export function useTickets() {
  const context = useContext(TicketContext);

  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }

  return context;
}
