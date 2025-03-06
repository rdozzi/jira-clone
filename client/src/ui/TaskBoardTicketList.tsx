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
    <Droppable droppableId={board.id} key={board.id}>
      {(provided) => (
        <TaskBoardCardComp
          boardName={board.name}
          openCreateTicketModal={openCreateTicketModal}
          {...provided.droppableProps}
          innerRef={provided.innerRef}
        >
          <MemoSpaceComponent>
            {tickets.map((ticket: Tickets, index: number) => (
              <Draggable
                key={ticket.id}
                draggableId={ticket.id.toString()}
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
            ))}
            {provided.placeholder}
          </MemoSpaceComponent>
        </TaskBoardCardComp>
      )}
    </Droppable>
  );
});

export default TaskBoardTicketList;
