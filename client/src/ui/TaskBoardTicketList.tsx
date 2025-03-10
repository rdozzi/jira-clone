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
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <TaskBoardCardComp
            boardName={board.name}
            openCreateTicketModal={openCreateTicketModal}
          >
            <MemoSpaceComponent>
              {tickets.map((ticket: Tickets, index: number) => (
                <Draggable
                  key={ticket.id}
                  draggableId={ticket.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
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
    (ticket, i) => ticket.id === nextProps.tickets[i]?.id
  );
}

export default TaskBoardTicketList;
