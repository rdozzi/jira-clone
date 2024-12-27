import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, Space } from 'antd';

const ticketsDataExample = [
  { id: 't1', name: 'Ticket 1', description: 'Create Task Board' },
  { id: 't2', name: 'Ticket 2', description: 'Creact Calendar' },
  { id: 't3', name: 'Ticket 3', description: 'Improve your App :oP' },
];

function TaskBoard() {
  return (
    <DragDropContext>
      <Droppable droppableId='tickets'>
        {(provided) => (
          <ul
            className='characters'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {ticketsDataExample.map((object, index) => (
              <Draggable key={object.id} draggableId={object.id} index={index}>
                {(provided) => (
                  <Space
                    direction='vertical'
                    size='middle'
                    style={{ display: 'flex' }}
                  >
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
                  </Space>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default TaskBoard;
