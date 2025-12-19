import { useMemo, useState, useCallback } from 'react';
import { Modal, Form } from 'antd';

import { useGetCommentsById } from '../features/comments/useGetCommentsById';
import { sortCommentObjects } from '../utilities/sortCommentObjects';
import { useCreateComment } from '../features/comments/useCreateComment';
import { useDeleteComment } from '../features/comments/useDeleteComment';
import { useUpdateComment } from '../features/comments/useUpdateComment';

import CreateCommentForm from './CreateCommentForm';
import CommentRowWithEditor from './CommentRowWithEditor';

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

  const handleOpenEditor = useCallback(
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
    },
    [openEditor]
  );

  const handleEditComment = useCallback(
    async function handleEditComment(commentId: number, content: string) {
      const trimmedContent = content.trim();
      try {
        const editPayload = { commentId: commentId, content: trimmedContent };
        editComment(editPayload);
      } catch (error) {
        console.error('Error updating comment: ', error);
      } finally {
        setOpenEditor(null);
      }
    },
    [editComment]
  );

  const handleCreateComment = useCallback(
    async function handleCreateComment(values: { content: string }) {
      const trimmedContent = values.content.trim();
      values.content = trimmedContent;
      try {
        const commentPayload: CommentPayload = {
          ...values,
          ticketId: recordId,
        };
        createNewComment(commentPayload);
      } catch (error) {
        console.error('Error creating comment: ', error);
      } finally {
        form.resetFields();
      }
    },
    [createNewComment, recordId, form]
  );

  const handleDeleteComment = useCallback(
    async function handleDeleteComment(commentId: number) {
      try {
        deleteComment(commentId);
      } catch (error) {
        console.error('Error deleting comment: ', error);
      }
    },
    [deleteComment]
  );

  if (error) return <div>Could not load Comment Data</div>;

  interface CommentPayload {
    content: string;
    ticketId: number;
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
              <CommentRowWithEditor
                comment={comment}
                openEditor={openEditor}
                isUpdating={isUpdating}
                editValue={editValue}
                isDeleting={isDeleting}
                setEditValue={setEditValue}
                setOpenEditor={setOpenEditor}
                handleEditComment={handleEditComment}
                handleOpenEditor={handleOpenEditor}
                handleDeleteComment={handleDeleteComment}
                key={comment.id}
              />
            ))}
        </ul>
        <CreateCommentForm
          handleCreateComment={handleCreateComment}
          isCreating={isCreating}
          form={form}
        />
      </>
    </Modal>
  );
}

export default CommentModal;
