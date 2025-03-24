import { Modal } from 'antd';
import { useGetCommentsById } from '../features/comments/useGetCommentsById';
import { sortCommentObjects } from '../utilities/sortCommentObjects';

function CommentModal({
  isCommentOpen,
  onOk,
  ticketTitle,
  ticketDescription,
  record,
}) {
  // Ticket-Specific Information (Record?):
  // Current comments associated with ticket
  // Field to add a comment
  const { isFetching, comments, error } = useGetCommentsById(record);
  const sortedComments = sortCommentObjects([...comments]);

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
        <ul style={{ display: 'contents' }}>
          {comments &&
            comments.map((comment) => (
              <li key={comment.id} style={{ listStyleType: 'none' }}>
                <span>{comment.content}</span>//<span>{comment.createdAt}</span>
              </li>
            ))}
        </ul>
      </>
    </Modal>
  );
}

export default CommentModal;
