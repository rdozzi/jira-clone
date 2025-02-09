// import { useState } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';

interface Record {
  assignee: { first_name: string; last_name: string };
  assigneeId: number;
  boardId: number;
  createdAt: string;
  description: string;
  dueDate: string;
  id: number;
  priority: string;
  reporterId: number;
  status: string;
  title: string;
  type: string;
  udpatedAt: string;
}

function TicketListItemButton({ record }: { record: Record }) {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  function onClick() {
    console.log(record);
    // setIsMenuOpen(!isMenuOpen);
  }

  return <EllipsisOutlined onClick={onClick} />;
}

export default TicketListItemButton;
