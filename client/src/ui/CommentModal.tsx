import { useMemo, useState } from 'react';
import { Modal, Input, Button, Form } from 'antd';
import { useGetCommentsById } from '../features/comments/useGetCommentsById';
import { sortCommentObjects } from '../utilities/sortCommentObjects';
import { useCreateComment } from '../features/comments/useCreateComment';
import { randomNumberGen } from '../utilities/randomNumberGen';
import { getLocalTime } from '../utilities/getLocalTime';

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
  const { createNewComment, isCreating } = useCreateComment(recordId);

  const sortedComments = useMemo(() => {
    return sortCommentObjects(comments ?? []);
  }, [comments]);

  const [form] = Form.useForm();

  if (error) return <div>Could not load Comment Data</div>;

  interface CommentPayload {
    content: string;
    ticketId: number;
    authorId: number;
  }

  async function onFinish(values: { content: string }) {
    try {
      const commentPayload: CommentPayload = {
        ...values,
        ticketId: recordId,
        authorId: randomNumberGen(1, 2),
      };
      console.log('Comment Payload:', commentPayload);
      await createNewComment(commentPayload);
    } catch (error) {
      console.error('Error updating ticket: ', error);
    } finally {
      form.resetFields();
    }
  }

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
                <span>{getLocalTime(comment.createdAt)}</span>
              </li>
            ))}
        </ul>
        <div>
          <Form onFinish={onFinish} form={form}>
            <Form.Item
              label='Comment'
              name='content'
              style={{ display: 'grid' }}
            >
              <TextArea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder='Enter your comment here'
                autoSize={{ minRows: 3 }}
                allowClear={true}
                showCount
                maxLength={200}
              />
            </Form.Item>
            <Form.Item label={null}>
              <Button
                variant='outlined'
                htmlType='submit'
                disabled={isCreating}
              >
                Add Comment
              </Button>
            </Form.Item>
          </Form>
        </div>
      </>
    </Modal>
  );
}

export default CommentModal;
