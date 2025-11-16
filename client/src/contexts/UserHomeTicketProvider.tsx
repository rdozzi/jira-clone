import { useEffect, useState } from 'react';
import { useUser } from './useUser';
import { UserHomeTicketContext } from './UserHomeTicketContext';
import { useGetTicketByAssigneeId } from '../features/tickets/useGetTicketsByAssigneeId';
import { useGetLogByUserId } from '../features/activityLogs/useGetLogByUserId';
import { Tickets } from '../types/Tickets';
import { ActivityLogs } from '../types/ActivityLogs';
import { mapActivityToMessage } from '../utilities/mapActivityToMessage';

type UserHomeTicketProviderProps = { children: React.ReactNode };

export const UserHomeTicketProvider = ({
  children,
}: UserHomeTicketProviderProps) => {
  const { userSelf } = useUser();
  const [assigneeId, setAssigneeId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (userSelf?.id) {
      setAssigneeId(userSelf.id);
    }
  }, [userSelf?.id]);

  const { isFetchingTicketsById, ticketsById, ticketsByIdError } =
    useGetTicketByAssigneeId(assigneeId);

  const { isFetchingLogs, activityLogs, activityLogsError } =
    useGetLogByUserId(assigneeId);

  const activeTickets: Tickets[] = (ticketsById ?? []).filter(
    (ticketById: Tickets) => {
      return ticketById.status !== 'DONE';
    }
  );

  const overDueTickets: Tickets[] = (ticketsById ?? []).filter(
    (ticketById: Tickets) => {
      const dueDate = new Date(ticketById.dueDate);
      const today = new Date();
      return dueDate < today;
    }
  );

  const upcomingDeadlines: Tickets[] = (ticketsById ?? []).filter(
    (ticketById: Tickets) => {
      const dueDate = new Date(ticketById.dueDate);
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + 7);
      return dueDate > today && dueDate < futureDate;
    }
  );

  const recentActivity: { [key: string]: any }[] = (activityLogs ?? []).map(
    (log: ActivityLogs) => {
      return mapActivityToMessage(log);
    }
  );

  return (
    <UserHomeTicketContext.Provider
      value={{
        activeTickets,
        overDueTickets,
        upcomingDeadlines,
        recentActivity,
        isFetchingTicketsById,
        ticketsByIdError,
        isFetchingLogs,
        activityLogsError,
      }}
    >
      {children}
    </UserHomeTicketContext.Provider>
  );
};
