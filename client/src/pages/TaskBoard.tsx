import { useState, useEffect } from 'react';
import { Space, Card } from 'antd';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useGetTickets } from '../features/tickets/useGetTickets';
import TaskBoardCardComp from '../ui/TaskBoardCardComp';

const boards = [
  { id: 'BACKLOG', name: 'Backlog' },
  { id: 'IN_PROGRESS', name: 'In Progress' },
  { id: 'DONE', name: 'Done' },
];

function TaskBoard() {
  const { isLoading, tickets = [], error } = useGetTickets();
  const [boardState, setBoardState] = useState({});

  useEffect(() => {
    if (tickets.length > 0) {
      setBoardState(() => initializeBoards(boards, tickets));
    }
  }, [tickets]);

  function initializeBoards(boards, tickets) {
    // Create an object with board IDs as keys and empty arrys as values
    const initialState = boards.reduce((acc, board) => {
      acc[board.id] = []; // Initialize each board's ticket list as empty
      return acc;
    }, {});

    tickets.forEach((ticket) => {
      if (initialState[ticket.status]) {
        initialState[ticket.status].push(ticket);
      }
    });

    return initialState;
  }

  function handleOnDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Create a shallow clone of the initial state
    const updatedBoards = { ...boardState };

    // Get the arrays of the source and destination boards
    const sourceBoard = updatedBoards[source.droppableId];
    const destinationBoard = updatedBoards[destination.droppableId];

    // Remove the item from the source board
    const [movedItem] = sourceBoard.splice(source.index, 1);

    // Add the item to the destination board
    destinationBoard.splice(destination.index, 0, movedItem);

    setBoardState({
      ...updatedBoards,
      [source.droppableId]: sourceBoard,
      [destination.droppableId]: destinationBoard,
    });
  }

  if (isLoading) {
    return <div> Loading... </div>;
  }

  return (
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
                <TaskBoardCardComp boardName={board.name}>
                  <Space
                    direction='vertical'
                    size='small'
                    style={{ display: 'flex' }}
                  >
                    {boardState[board.id]?.map((ticket, index) => (
                      <Draggable
                        key={ticket.id}
                        draggableId={ticket.title}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            title={ticket.title}
                            bordered={false}
                            size='small'
                          >
                            <p>{ticket.description}</p>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Space>
                </TaskBoardCardComp>
              </div>
            )}
          </Droppable>
        ))}
      </Space>
    </DragDropContext>
  );
}

export default TaskBoard;
