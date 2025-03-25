import { useMemo } from 'react';
import { Modal } from 'antd';
import { useGetCommentsById } from '../features/comments/useGetCommentsById';
import { sortCommentObjects } from '../utilities/sortCommentObjects';

interface CommentModalProps {
  isCommentOpen: boolean;
  onOk: () => void;
  ticketTitle: string;
  ticketDescription: string;
  recordId: number;
}

function CommentModal({
  isCommentOpen,
  onOk,
  ticketTitle,
  ticketDescription,
  recordId,
}: CommentModalProps) {
  // Field to add a comment
  const { isFetching, comments, error } = useGetCommentsById(recordId);

  const sortedComments = useMemo(() => {
    if (!comments) return [];

    return sortCommentObjects(comments);
  }, [comments]);

  if (error) return <div>Could not load Comment Data</div>;

  return (
    <Modal
      open={isCommentOpen}
      onOk={onOk}
      onCancel={onOk}
      cancelButtonProps={{ style: { display: 'none' } }}
      destroyOnClose={true}
      title={'Comments'}
      loading={isFetching}
    >
      <>
        <div>Title: {ticketTitle}</div>
        <div>Description: {ticketDescription}</div>
        <ul style={{ display: 'contents' }}>
          {sortedComments &&
            sortedComments.map((comment) => (
              <li key={comment.id} style={{ listStyleType: 'none' }}>
                <span>{comment.content}</span> //{' '}
                <span>{comment.createdAt.toLocaleString()}</span>
              </li>
            ))}
        </ul>
      </>
    </Modal>
  );
}

export default CommentModal;
