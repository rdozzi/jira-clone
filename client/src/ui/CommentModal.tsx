import { Modal } from 'antd';

function CommentModal({ isCommentOpen, onOk, ticketTitle, ticketDescription }) {
  // Ticket-Specific Information (Record?):
  // Current comments associated with ticket
  // Field to add a comment

  return (
    <Modal
      open={isCommentOpen}
      onOk={onOk}
      onCancel={onOk}
      cancelButtonProps={{ style: { display: 'none' } }}
      destroyOnClose={true}
      title={'Comments'}
    >
      <>
        <div>Title: {ticketTitle}</div>
        <div>Description: {ticketDescription}</div>
      </>
    </Modal>
  );
}

export default CommentModal;
