import { useState, useEffect } from 'react';

import { DragDropContext } from '@hello-pangea/dnd';

import { useTickets } from '../contexts/useTickets';
import { useModal } from '../contexts/useModal';

import TicketModal from '../ui/TicketModal';
import TaskBoardColumn from '../ui/TaskBoardColumn';

import { useDragHandler } from '../hooks/useDragHandler';

export interface Board {
  id: string;
  name: string;
}

export interface Tickets {
  assignee: { firstName: string; lastName: string };
  assigneeId: number;
  boardId: number;
  createdAt: Date;
  description: string;
  dueDate: Date;
  id: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reporterId: number;
  status: 'BACKLOG' | 'IN_PROGRESS' | 'DONE';
  title: string;
  type: 'BUG' | 'TASK' | 'STORY';
  updatedAt: Date;
}

type BoardState = Record<string, Tickets[]>;

const boards: Board[] = [
  { id: 'BACKLOG', name: 'Backlog' },
  { id: 'IN_PROGRESS', name: 'In Progress' },
  { id: 'DONE', name: 'Done' },
];

function TaskBoard() {
  const [boardState, setBoardState] = useState<BoardState>({});
  const { isLoading, tickets = [] } = useTickets(); // Add error later
  const { isOpen, openModal, closeModal, mode, modalProps } = useModal();
  const handleOnDragEnd = useDragHandler(setBoardState);

  const record = modalProps?.record;

  useEffect(() => {
    if (!isLoading && tickets.length > 0) {
      setBoardState(() => initializeBoards(boards, tickets));
    }
  }, [isLoading, tickets]);

  function openCreateTicketModal() {
    openModal('create', {});
  }

  function initializeBoards(boards: Board[], tickets: Tickets[]) {
    // Create an object with board IDs as keys and empty arrys as values
    const initialState: Record<string, Tickets[]> = boards.reduce(
      (acc, board) => {
        acc[board.id] = []; // Initialize each board's ticket list as empty
        return acc;
      },
      {} as Record<string, Tickets[]>
    );

    tickets.forEach((ticket) => {
      if (initialState[ticket.status]) {
        initialState[ticket.status].push(ticket);
      }
    });

    return initialState;
  }

  if (isLoading) {
    return <div> Loading... </div>;
  }

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
