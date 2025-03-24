import { Modal } from 'antd';

function CommentModal({ isCommentOpen, onOk }) {
  // Ticket-Specific Information (Record?)
  // Current comments associated with ticket
  // Field to add a comment

  return (
    <Modal
      open={isCommentOpen}
      onOk={onOk}
      onCancel={onOk}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      Comment Check
    </Modal>
  );
}

export default CommentModal;
