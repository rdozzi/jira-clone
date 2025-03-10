import { useState, useEffect } from 'react';

import { Space } from 'antd';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

import { useGetTickets } from '../features/tickets/useGetTickets';
import { useModal } from '../contexts/useModal';

import TicketModal from '../ui/TicketModal';
import TaskBoardColumn from '../ui/TaskBoardColumn';

interface Board {
  id: string;
  name: string;
}

export interface Tickets {
  assignee: { first_name: string; last_name: string };
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
  const { isLoading, tickets = [] } = useGetTickets(); // Add error later
  const { isOpen, openModal, closeModal, mode, modalProps } = useModal();

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

  function handleOnDragEnd(result: DropResult) {
    console.log(result);
    const { source, destination } = result;
    if (!destination) return; // Ignore if dropped outside a droppable area

    // If the item is moved to the same position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    console.log('Before Update:', boardState);

    setBoardState((prev) => {
      // Clone only the affected board(s) instead of the entire state
      const sourceBoard = [...(prev[source.droppableId] || [])];

      // Ensure the item exists before moving
      if (!sourceBoard[source.index]) return prev;

      // Clone the ticket to avoid mutation
      const movedItem = { ...sourceBoard[source.index] };

      // Remove from the source board
      sourceBoard.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        // Move inside the same board (reorder)
        sourceBoard.splice(destination.index, 0, movedItem);

        // Update the state for that board only
        const newState = {
          ...prev,
          [source.droppableId]: sourceBoard,
        };

        console.log('After Same-Board Move:', newState);
        return newState;
      } else {
        // Moving to a different board
        const destinationBoard = [...(prev[destination.droppableId] || [])];
        movedItem.status = destination.droppableId as
          | 'BACKLOG'
          | 'IN_PROGRESS'
          | 'DONE';
        destinationBoard.splice(destination.index, 0, movedItem);

        // Set the new state with fresh references
        const newState = {
          ...prev,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };

        console.log('After Update:', newState);
        return newState;
      }
    });
  }

  if (isLoading) {
    return <div> Loading... </div>;
  }

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Space direction='horizontal' size='small' style={{ display: 'flex' }}>
          {boards.map((board) => (
            <TaskBoardColumn
              key={board.id}
              board={board}
              tickets={boardState[board.id] || []}
              openCreateTicketModal={openCreateTicketModal}
            />
          ))}
        </Space>
      </DragDropContext>
      {mode === 'create' && (
        <TicketModal
          isOpen={isOpen}
          closeModal={closeModal}
          mode={mode}
          {...modalProps}
        />
      )}
    </>
  );
}

export default TaskBoard;
