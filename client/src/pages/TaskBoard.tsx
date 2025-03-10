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
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Create a deep copy of only affected boards clone of the initial state
    // const updatedBoards: BoardState = JSON.parse(JSON.stringify(boardState));
    const updatedSourceBoard = [...(boardState[source.droppableId] || [])];
    const updatedDestinationBoard = [
      ...(boardState[destination.droppableId] || []),
    ];

    // Get the arrays of the source and destination boards
    // const sourceBoard = updatedBoards[source.droppableId] ?? [];
    // const destinationBoard = updatedBoards[destination.droppableId] ?? [];

    // Remove the item from the source board
    const [movedItem] = updatedSourceBoard.splice(source.index, 1);

    updatedDestinationBoard.splice(destination.index, 0, movedItem);

    // Add the item to the destination board
    // destinationBoard.splice(destination.index, 0, movedItem);

    setBoardState((prev) => ({
      ...prev,
      [source.droppableId]: updatedSourceBoard,
      [destination.droppableId]: updatedDestinationBoard,
    }));

    // function createNewBoard(boardName: string) {
    //   if (!updatedBoards[boardName]) {
    //     updatedBoards[boardName] = [];
    //   }
    // }
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
              // boardState={boardState}
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
