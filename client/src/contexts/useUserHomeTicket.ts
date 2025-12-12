import { UserHomeTicketContext } from './UserHomeTicketContext';
import { useContext } from 'react';

export function useUserHomeTicket() {
  const context = useContext(UserHomeTicketContext);

  if (!context) {
    throw new Error(
      'useUserTicketHome must be used within a UserHomeTicketProvider'
    );
  }

  return context;
}
