import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, Space } from 'antd';

const ticketsDataExample = [
  { id: 't1', name: 'Ticket 1', description: 'Create Task Board' },
  { id: 't2', name: 'Ticket 2', description: 'Create Calendar' },
  { id: 't3', name: 'Ticket 3', description: 'Improve your App :oP' },
];

function TaskBoard() {
  const [tickets, setTickets] = useState(ticketsDataExample);

  function handleTickets(result) {
    const { source, destination, type } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;
    const items = Array.from(tickets);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    setTickets(items);
  }

  return (
    <DragDropContext onDragEnd={handleTickets}>
      <Droppable droppableId='tickets'>
        {(provided) => (
          <ul
            className='tickets'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <Space
              direction='vertical'
              size='small'
              style={{ display: 'flex' }}
            >
              {tickets.map((object, index) => (
                <Draggable
                  key={object.id}
                  draggableId={object.id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      title={object.name}
                      bordered={false}
                      size='small'
                    >
                      <p>{object.description}</p>
                    </Card>
                  )}
                </Draggable>
              ))}
            </Space>
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default TaskBoard;
