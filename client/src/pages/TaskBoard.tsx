import React from 'react';
import { Card } from 'antd';

const ticketsDataExample = [
  { id: 't1', name: 'Ticket 1', description: 'Create Task Board' },
  { id: 't2', name: 'Ticket 2', description: 'Creact Calendar' },
  { id: 't3', name: 'Ticket 3', description: 'Improve your App :oP' },
];

function TaskBoard() {
  return (
    <ul>
      {ticketsDataExample.map((object) => (
        // <li key={object.id}>
        //   <div>{object.name}</div>
        //   <div>{object.description}</div>
        // </li>
        <Card title={object.name} bordered={false} style={{ width: 300 }}>
          <p>{object.description}</p>
        </Card>
      ))}
    </ul>
  );
}

export default TaskBoard;
