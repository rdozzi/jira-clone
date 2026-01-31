import { useState, useEffect } from 'react';

import { DragDropContext } from '@hello-pangea/dnd';

import { useTickets } from '../contexts/useTickets';
import { useTicketModal } from '../contexts/modalContexts/useTicketModal';

import TicketModal from '../ui/TicketModal';
import TaskBoardColumn from '../ui/TaskBoardColumn';
import Loading from '../ui/Loading';

import { useDragHandler } from '../hooks/useDragHandler';

import { Ticket } from '../types/Ticket';

// The statuses of the task boards are hard coded in this component.
export interface StaticTaskBoards {
  id: string;
  name: string;
}

type BoardState = Record<string, Ticket[]>;

const boards: StaticTaskBoards[] = [
  { id: 'BACKLOG', name: 'Backlog' },
  { id: 'IN_PROGRESS', name: 'In Progress' },
  { id: 'DONE', name: 'Done' },
];

function TaskBoard() {
  const [boardState, setBoardState] = useState<BoardState>({});
  const { isLoading, tickets = [], error } = useTickets();
  const { isOpen, openModal, closeModal, mode, modalProps } = useTicketModal();
  const handleOnDragEnd = useDragHandler(setBoardState);

  const record = modalProps?.record;

  useEffect(() => {
    if (isLoading) return;

    if (tickets.length > 0) {
      setBoardState(() => initializeBoards(boards, tickets));
    } else {
      setBoardState((prev) => {
        const hasTickets = Object.values(prev).some((arr) => arr.length > 0);
        return hasTickets ? initializeBoards(boards, []) : prev;
      });
    }
  }, [isLoading, tickets]);

  function openCreateTicketModal() {
    openModal('create', {});
  }

  function initializeBoards(boards: StaticTaskBoards[], tickets: Ticket[]) {
    // Create an object with board IDs as keys and empty arrys as values
    const initialState: Record<string, Ticket[]> = boards.reduce(
      (acc, board) => {
        acc[board.id] = []; // Initialize each board's ticket list as empty
        return acc;
      },
      {} as Record<string, Ticket[]>,
    );

    tickets.forEach((ticket) => {
      if (initialState[ticket.status]) {
        initialState[ticket.status].push(ticket);
      }
    });

    return initialState;
  }

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  if (error) return <div>Error loading tickets!</div>;

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {boards.map((board) => (
            <TaskBoardColumn
              key={board.id}
              board={board}
              tickets={boardState[board.id] || []}
              openCreateTicketModal={openCreateTicketModal}
            />
          ))}
        </div>
      </DragDropContext>
      <TicketModal
        isOpen={isOpen}
        closeModal={closeModal}
        mode={mode}
        record={record}
      />
    </>
  );
}

export default TaskBoard;
