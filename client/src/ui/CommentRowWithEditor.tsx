import { memo } from 'react';
import { Space, Input, Button, Tooltip, Popconfirm } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { getLocalTime } from '../utilities/getLocalTime';
import { areStringsIdentical } from '../utilities/areStringsIdentical';

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
                    comment.content
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
      <Tooltip title='Edit Comment'>
        <Button
          type='text'
          shape='circle'
          icon={<EditOutlined />}
          size='small'
          onClick={() => handleOpenEditor(comment.id, comment.content)}
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
  );
});

export default CommentRowWithEditor;
