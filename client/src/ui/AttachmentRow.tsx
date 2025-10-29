import { Attachment } from '../types/Attachments';
import { Button, Flex, Popconfirm, Tooltip } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDeleteAttachment } from '../features/attachments/useDeleteAttachment';
import { EntityType } from '../types/Attachments';
import { ModalPropsWithRecord } from './AttachmentModal';
import { useAttachmentModal } from '../contexts/useAttachmentModal';

function editFilename(fileName: string) {
  const dashIndex = fileName.indexOf('-', 0);
  const updatedFilename = fileName.slice(dashIndex + 1, fileName.length);
  return updatedFilename;
}

function AttachmentRow({ attachment }: { attachment: Attachment }) {
  const { mode, modalProps } = useAttachmentModal() as {
    isOpen: boolean;
    closeModal: () => void;
    mode: EntityType;
    modalProps: ModalPropsWithRecord;
  };
  const { deleteSingleAttachment, isDeletingAttachment } = useDeleteAttachment(
    mode,
    typeof modalProps?.id === 'number' ? modalProps.id : -1
  );

  return (
    <Flex justify='flex-start' align='center' gap='small'>
      {editFilename(attachment.fileName)}
      <Button icon={<DownloadOutlined />} />
      <Popconfirm
        title='Delete Attachments'
        description='Are you sure you want to delete this attachment?'
        onConfirm={() => deleteSingleAttachment(attachment.id)}
        onCancel={() => console.log('User canceled deletion')}
        placement='top'
        okText='Yes'
        cancelText='No'
      >
        <Tooltip title='Delete Attachment'>
          <Button icon={<DeleteOutlined />} disabled={isDeletingAttachment} />
        </Tooltip>
      </Popconfirm>
    </Flex>
  );
}

export default AttachmentRow;
