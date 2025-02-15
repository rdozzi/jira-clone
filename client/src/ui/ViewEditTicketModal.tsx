import { Modal, Input } from 'antd';

import { Record } from './TicketListItemButton';

import { useGetUsers } from '../features/users/useGetUsers';

// export interface Record {
//   assignee: { first_name: string; last_name: string };
//   assigneeId: number;
//   boardId: number;
//   createdAt: string;
//   description: string;
//   dueDate: string;
//   id: number;
//   priority: string;
//   reporterId: number;
//   status: string;
//   title: string;
//   type: string;
//   udpatedAt: string;
// }

function ViewEditTicketModal({
  closeModal,
  record,
}: {
  closeModal: () => void;
  record: Record;
}) {
  const { title, description, dueDate, status, priority, type } = record;
  return (
    <Modal
      title='View/Edit Ticket'
      open={true}
      onCancel={closeModal}
      onOk={closeModal}
      mask={false}
    ></Modal>
  );
}

export default ViewEditTicketModal;
