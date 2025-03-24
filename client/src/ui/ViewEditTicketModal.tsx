import { Modal } from 'antd';

function ViewEditTicketModal({ closeModal }: { closeModal: () => void }) {
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
