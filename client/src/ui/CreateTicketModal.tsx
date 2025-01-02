import { useState } from 'react';
import { Modal } from 'antd';

function CreateTicketModal({ open, onClose }) {
  const [confirmLoading, setConfirmLoading] = useState(false);

  function handleOk() {
    setConfirmLoading(true);
    setTimeout(() => {
      onClose();
      setConfirmLoading(false);
    }, 2000);
  }

  function handleCancel() {
    onClose();
  }

  return (
    <Modal
      title='Title'
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      open={open}
      onClose={onClose}
    >
      <p>Modal Text Box!</p>
    </Modal>
  );
}

export default CreateTicketModal;
