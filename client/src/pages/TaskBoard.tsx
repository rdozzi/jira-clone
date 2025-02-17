import { useState, useEffect } from 'react';
import { Space, Card } from 'antd';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useGetTickets } from '../features/tickets/useGetTickets';

const boards = [
  { id: 'BACKLOG', name: 'Backlog' },
  { id: 'IN_PROGRESS', name: 'In Progress' },
  { id: 'DONE', name: 'Done' },
];

// const tickets = [
//   {
//     id: 't1',
//     name: 'Ticket 1',
//     description: 'Create Task Board',
//     status: 'inProgress',
//   },
//   {
//     id: 't2',
//     name: 'Ticket 2',
//     description: 'Create Calendar',
//     status: 'backlog',
//   },
//   {
//     id: 't3',
//     name: 'Ticket 3',
//     description: 'Improve your App :oP',
//     status: 'backlog',
//   },
// ];

function TaskBoard() {
  const { isLoading, tickets = [], error } = useGetTickets();
  const [boardState, setBoardState] = useState({});

  useEffect(() => {
    if (tickets.length > 0) {
      console.log(tickets);
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

  console.log(boardState);

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
                <Card title={board.name} bordered={false}>
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
                </Card>
              </div>
            )}
          </Droppable>
        ))}
      </Space>
    </DragDropContext>
  );
}

export default TaskBoard;
