import { memo } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import MemoSpaceComponent from './MemoSpaceComponent';
import TaskBoardCardComp from './TaskBoardCardComp';
import TaskBoardTicketCardComp from './TaskBoardTicketCardComp';

import { Tickets } from '../pages/TaskBoard';

const TaskBoardTicketList = memo(function TaskBoardTicketList({
  board,
  tickets = [],
  openCreateTicketModal,
}) {
  return (
    <Droppable droppableId={board.id} key={board.id} isDropDisabled={false}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            minHeight: '300px',
            padding: '8px',
            backgroundColor: snapshot.isDraggingOver
              ? '#f5f5f5'
              : 'transparent',
            transition: 'background-color 0.2s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start', // Aligns correctly
          }}
        >
          <TaskBoardCardComp
            boardName={board.name}
            openCreateTicketModal={openCreateTicketModal}
          >
            <MemoSpaceComponent>
              {tickets.length === 0 && !snapshot.isDraggingOver && (
                <div
                  style={{
                    height: '80px',
                    width: '100%',
                    opacity: 0.3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none', // This makes sure it's not interactable
                    border: '1px dashed #ccc',
                    borderRadius: '4px',
                  }}
                >
                  Drop tasks here
                </div>
              )}
              {tickets.map((ticket: Tickets, index: number) => (
                <Draggable
                  key={ticket.id}
                  draggableId={ticket.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        transition: snapshot.isDragging
                          ? 'none'
                          : 'transform 0.2s ease-out',
                        ...provided.draggableProps.style,
                      }}
                    >
                      <TaskBoardTicketCardComp ticket={ticket}>
                        <p>{ticket.description}</p>
                      </TaskBoardTicketCardComp>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </MemoSpaceComponent>
          </TaskBoardCardComp>
        </div>
      )}
    </Droppable>
  );
},
arePropsEqual);

function arePropsEqual(prevProps, nextProps) {
  if (prevProps.board !== nextProps.board) return false;
  if (prevProps.tickets.length !== nextProps.tickets.length) return false;
  return prevProps.tickets.every(
    (ticket, i) =>
      ticket.id === nextProps.tickets[i]?.id &&
      ticket.status === nextProps.tickets[i]?.status
  );
}

export default TaskBoardTicketList;
