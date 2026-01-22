import { memo } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { TaskBoardColumnProps } from './TaskBoardColumn';

import MemoSpaceComponent from './MemoSpaceComponent';
import TaskBoardCardComp from './TaskBoardCardComp';
import TaskBoardTicketCardComp from './TaskBoardTicketCardComp';
import PhantomDraggable from './PhantomDraggable';

import { Tickets } from '../types/Tickets';

const TaskBoardCompContainer = memo(function TaskBoardCompContainer({
  board,
  tickets = [],
  openCreateTicketModal,
}: TaskBoardColumnProps) {
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
            transition:
              'background-color 0.2s ease-in-out, height 2s ease-in-out',
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
              {tickets.length === 0 && (
                <PhantomDraggable
                  boardId={board.id}
                  isDraggingOver={snapshot.isDraggingOver}
                />
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
                        background: 'white',
                        padding: '12px',
                        borderRadius: '6px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                        transition: snapshot.isDragging
                          ? 'none' // No transition while dragging
                          : 'transform 0.3s ease-in-out',
                        opacity: snapshot.isDragging ? 0.8 : 1,
                        transform: snapshot.isDragging
                          ? 'scale(1.05)'
                          : 'scale(1)',
                        ...provided.draggableProps.style, // Preserve default drag styles
                      }}
                    >
                      <TaskBoardTicketCardComp ticket={ticket} />
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

function arePropsEqual(
  prevProps: TaskBoardColumnProps,
  nextProps: TaskBoardColumnProps
): boolean {
  if (prevProps.board !== nextProps.board) return false;
  if (prevProps.tickets.length !== nextProps.tickets.length) return false;
  return prevProps.tickets.every(
    (ticket, i) =>
      ticket.id === nextProps.tickets[i]?.id &&
      ticket.status === nextProps.tickets[i]?.status &&
      ticket.title === nextProps.tickets[i]?.title &&
      ticket.description === nextProps.tickets[i]?.description
  );
}

export default TaskBoardCompContainer;
