import { useMemo, useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { useGetCommentsById } from '../features/comments/useGetCommentsById';
import { sortCommentObjects } from '../utilities/sortCommentObjects';
import { useCreateComment } from '../features/comments/useCreateComment';

interface CommentModalProps {
  isCommentOpen: boolean;
  onOk: () => void;
  ticketTitle: string;
  ticketDescription: string;
  recordId: number;
}

const { TextArea } = Input;

function CommentModal({
  isCommentOpen,
  onOk,
  ticketTitle,
  ticketDescription,
  recordId,
}: CommentModalProps) {
  // Field to add a comment
  const [value, setValue] = useState('');
  const { isFetching, comments, error } = useGetCommentsById(recordId);
  const { createNewComment, isCreating } = useCreateComment();

  console.log(createNewComment, isCreating);

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
        <div>
          <TextArea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder='Enter your comment here'
            autoSize={{ minRows: 3 }}
          />
        </div>
      </>
    </Modal>
  );
}

export default CommentModal;
