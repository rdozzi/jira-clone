import { useMemo, useState } from 'react';
import { Modal, Input, Button, Form, Tooltip, Popconfirm, Space } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useGetCommentsById } from '../features/comments/useGetCommentsById';
import { sortCommentObjects } from '../utilities/sortCommentObjects';
import { useCreateComment } from '../features/comments/useCreateComment';
import { useDeleteComment } from '../features/comments/useDeleteComment';
import { useUpdateComment } from '../features/comments/useUpdateComment';

import { randomNumberGen } from '../utilities/randomNumberGen';
import { getLocalTime } from '../utilities/getLocalTime';
import { areStringsIdentical } from '../utilities/areStringsIdentical';

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
  const [createValue, setCreateValue] = useState('');
  const [editValue, setEditValue] = useState<string | null>('');
  const [openEditor, setOpenEditor] = useState<number | null>(null);
  const { isFetching, comments, error } = useGetCommentsById(recordId);
  const { createNewComment, isCreating } = useCreateComment(recordId);
  const { deleteComment, isDeleting } = useDeleteComment(recordId);
  const { editComment, isUpdating } = useUpdateComment(recordId);

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

  function handleOpenEditor(id: number, content: string) {
    if (openEditor === null) {
      setOpenEditor(id);
      setEditValue(content);
    } else if (openEditor === id) {
      setOpenEditor(null);
    } else if (openEditor !== id) {
      setOpenEditor(id);
      setEditValue(content);
    }
  }

  async function handleEditComment(commentId: number, content: string) {
    const trimmedContent = content.trim();
    try {
      const editPayload = { commentId: commentId, content: trimmedContent };
      console.log(editPayload);
      await editComment(editPayload);
    } catch (error) {
      console.error('Error updating comment: ', error);
    } finally {
      setOpenEditor(null);
    }
  }

  async function handleCreateComment(values: { content: string }) {
    const trimmedContent = values.content.trim();
    values.content = trimmedContent;
    try {
      const commentPayload: CommentPayload = {
        ...values,
        ticketId: recordId,
        authorId: randomNumberGen(1, 2),
      };
      console.log('Comment Payload:', commentPayload);
      await createNewComment(commentPayload);
    } catch (error) {
      console.error('Error creating comment: ', error);
    } finally {
      form.resetFields();
    }
  }

  async function handleDeleteComment(commentId: number) {
    try {
      console.log('Deleting comment: ', commentId);
      await deleteComment(commentId);
    } catch (error) {
      console.error('Error deleting comment: ', error);
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
                {openEditor === comment.id ? (
                  <Space.Compact>
                    <Input
                      defaultValue={comment.content}
                      disabled={isUpdating}
                      value={editValue || ''}
                      onChange={(e) => setEditValue(e.target.value)}
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    />
                    <Tooltip title='Confirm Changes'>
                      <Button
                        icon={<CheckOutlined />}
                        onClick={() => {
                          if (
                            areStringsIdentical(
                              editValue || comment.content,
                              comment.content
                            )
                          ) {
                            setOpenEditor(null);
                          } else {
                            handleEditComment(
                              comment.id,
                              editValue || comment.content
                            );
                          }
                        }}
                        disabled={isUpdating}
                      />
                    </Tooltip>
                    <Tooltip title='Cancel Changes'>
                      <Button
                        icon={<CloseOutlined />}
                        onClick={() => setOpenEditor(null)}
                        disabled={isUpdating}
                      />
                    </Tooltip>
                  </Space.Compact>
                ) : (
                  <>
                    <span>{comment.content}</span> //{' '}
                    <span>{getLocalTime(comment.updatedAt)}</span>
                  </>
                )}
                <Tooltip title='Edit Comment'>
                  <Button
                    type='text'
                    shape='circle'
                    icon={<EditOutlined />}
                    size='small'
                    onClick={() =>
                      handleOpenEditor(comment.id, comment.content)
                    }
                  ></Button>
                </Tooltip>
                <Popconfirm
                  title='Delete Comment'
                  description='Are you sure you want to delete this comment?'
                  onConfirm={() => handleDeleteComment(comment.id)}
                  onCancel={() => console.log('User canceled deletion')}
                  placement='top'
                  okText='Yes'
                  cancelText='No'
                >
                  <Tooltip title='Delete Comment'>
                    <Button
                      type='text'
                      shape='circle'
                      icon={<DeleteOutlined />}
                      size='small'
                      disabled={isDeleting}
                      danger
                    ></Button>
                  </Tooltip>
                </Popconfirm>
              </li>
            ))}
        </ul>
        <div>
          <Form onFinish={handleCreateComment} form={form}>
            <Form.Item
              label='Comment'
              name='content'
              style={{ display: 'grid' }}
            >
              <Input.TextArea
                value={createValue}
                onChange={(e) => setCreateValue(e.target.value)}
                placeholder='Enter your comment here'
                autoSize={{ minRows: 3 }}
                allowClear={true}
                showCount
                minLength={1}
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
