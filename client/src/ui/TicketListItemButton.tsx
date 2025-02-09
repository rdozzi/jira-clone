// import { useState } from 'react';
import { Modal, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useModal } from './useModal';

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
  const { isOpen, openModal, closeModal } = useModal();
  function onClick() {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  }

  return (
    <>
      <Button type='text' onClick={onClick}>
        <EllipsisOutlined />
      </Button>
      {isOpen && (
        <Modal
          title='Basic Modal'
          open={isOpen}
          onOk={closeModal}
          onCancel={closeModal}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      )}
    </>
  );
}

export default TicketListItemButton;
