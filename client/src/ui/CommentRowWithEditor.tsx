import { memo } from 'react';
import { Space, Input, Button, Tooltip, Popconfirm } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import { getLocalTime } from '../utilities/getLocalTime';
import { areStringsIdentical } from '../utilities/areStringsIdentical';
import { useAttachmentModal } from '../contexts/useAttachmentModal';
import { useUser } from '../contexts/useUser';
import { DemoPopover } from './DemoPopover';

interface CommentRowWithEditorProps {
  comment: {
    id: number;
    ticketId: number;
    authorId: number;
    content: string;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
  openEditor: number | null;
  isUpdating: boolean;
  isDeleting: boolean;
  editValue: string | null;
  setEditValue: (_value: React.SetStateAction<string | null>) => void;
  setOpenEditor: (_value: React.SetStateAction<number | null>) => void;
  handleEditComment: (_commentId: number, _content: string) => void;
  handleOpenEditor: (_commentId: number, _content: string) => void;
  handleDeleteComment: (_commentId: number) => void;
}

const CommentRowWithEditor = memo(function CommentRowWithEditor({
  comment,
  openEditor,
  isUpdating,
  isDeleting,
  editValue,
  setEditValue,
  setOpenEditor,
  handleEditComment,
  handleOpenEditor,
  handleDeleteComment,
}: CommentRowWithEditorProps) {
  const { userSelf } = useUser();
  const { openModal } = useAttachmentModal();
  function openAttachmentModal() {
    openModal('COMMENT', { id: comment.id, comment });
  }
  return (
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
                    comment.content,
                  )
                ) {
                  setOpenEditor(null);
                } else {
                  handleEditComment(comment.id, editValue || comment.content);
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
      <DemoPopover content='This feature is not available for demo users'>
        <Tooltip title='Edit Comment'>
          <Button
            disabled={userSelf?.isDemoUser}
            type='text'
            shape='circle'
            icon={<EditOutlined />}
            size='small'
            onClick={() => handleOpenEditor(comment.id, comment.content)}
          ></Button>
        </Tooltip>
      </DemoPopover>
      <DemoPopover content='This feature is not available for demo users'>
        <Popconfirm
          title='Delete Comment'
          description='Are you sure you want to delete this comment?'
          onConfirm={() => handleDeleteComment(comment.id)}
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
              disabled={isDeleting || userSelf?.isDemoUser}
              danger
            ></Button>
          </Tooltip>
        </Popconfirm>
      </DemoPopover>
      <DemoPopover content='This feature is not available for demo users'>
        <Tooltip title='See Attachments'>
          <Button
            type='text'
            shape='circle'
            icon={<PaperClipOutlined />}
            size='small'
            onClick={openAttachmentModal}
            disabled={userSelf?.isDemoUser}
          ></Button>
        </Tooltip>
      </DemoPopover>
    </li>
  );
});

export default CommentRowWithEditor;
