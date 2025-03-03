import { useState, useEffect } from 'react';

import { Space } from 'antd';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

import { useGetTickets } from '../features/tickets/useGetTickets';
import { useModal } from '../contexts/useModal';

import TaskBoardCardComp from '../ui/TaskBoardCardComp';
import TaskBoardTicketCardComp from '../ui/TaskBoardTicketCardComp';

import TicketModal from '../ui/TicketModal';

interface Board {
  id: string;
  name: string;
}

interface Tickets {
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
    if (tickets.length > 0) {
      setBoardState(() => initializeBoards(boards, tickets));
    }
  }, [tickets]);

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

    // Create a shallow clone of the initial state
    const updatedBoards: BoardState = { ...boardState };
    console.log(updatedBoards);

    // Get the arrays of the source and destination boards
    const sourceBoard = updatedBoards[source.droppableId] ?? [];
    const destinationBoard = updatedBoards[destination.droppableId] ?? [];

    // Remove the item from the source board
    const [movedItem] = sourceBoard.splice(source.index, 1);

    // Add the item to the destination board
    destinationBoard.splice(destination.index, 0, movedItem);

    setBoardState({
      ...updatedBoards,
      [source.droppableId]: sourceBoard,
      [destination.droppableId]: destinationBoard,
    });

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
            <Droppable droppableId={board.id} key={board.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ width: '300px', textAlign: 'center' }}
                >
                  <TaskBoardCardComp
                    boardName={board.name}
                    openCreateTicketModal={openCreateTicketModal}
                  >
                    <Space
                      direction='vertical'
                      size='small'
                      style={{ display: 'flex' }}
                    >
                      {boardState[board.id]?.map(
                        (ticket: Tickets, index: number) => (
                          <Draggable
                            key={ticket.id}
                            draggableId={ticket.title}
                            index={index}
                          >
                            {(provided) => (
                              <TaskBoardTicketCardComp
                                draggableProps={provided.draggableProps}
                                dragHandleProps={provided.dragHandleProps}
                                innerRef={provided.innerRef}
                                ticket={ticket}
                              >
                                <p>{ticket.description}</p>
                              </TaskBoardTicketCardComp>
                            )}
                          </Draggable>
                        )
                      )}
                      {provided.placeholder}
                    </Space>
                  </TaskBoardCardComp>
                </div>
              )}
            </Droppable>
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
