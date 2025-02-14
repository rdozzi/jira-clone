import { Modal } from 'antd';

import { Record } from './TicketListItemButton';

function ViewEditTicketModal({
  closeModal,
  record,
}: {
  closeModal: () => void;
  record: Record;
}) {
  return (
    <Modal
      title='View/Edit Ticket'
      open={true}
      onCancel={closeModal}
      footer={null}
    >
      <p>Ticket Title: {record.title}</p>
      <p>Ticket Description: {record.description}</p>
    </Modal>
  );
}

export default ViewEditTicketModal;
