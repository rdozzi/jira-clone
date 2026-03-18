import { useState } from 'react';
import { Attachment } from '../types/Attachments';
import { Button, Flex, Popconfirm, Tooltip } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDeleteAttachment } from '../features/attachments/useDeleteAttachment';
import { EntityType } from '../types/Attachments';
import { ModalPropsWithRecord } from './AttachmentModal';
import { useAttachmentModal } from '../contexts/useAttachmentModal';
import { downloadAttachment } from '../services/apiAttachments';
import { useUser } from '../contexts/useUser';
import { DemoPopover } from './DemoPopover';

function editFilename(fileName: string) {
  const dashIndex = fileName.indexOf('-', 0);
  const updatedFilename = fileName.slice(dashIndex + 1, fileName.length);
  return updatedFilename;
}

function AttachmentRow({ attachment }: { attachment: Attachment }) {
  const [isDownloadingAttachment, setIsDownloadingAttachment] = useState(false);
  const { mode, modalProps } = useAttachmentModal() as {
    isOpen: boolean;
    closeModal: () => void;
    mode: EntityType;
    modalProps: ModalPropsWithRecord;
  };
  const { deleteSingleAttachment, isDeletingAttachment } = useDeleteAttachment(
    mode,
    typeof modalProps?.id === 'number' ? modalProps.id : -1,
  );
  const { userSelf } = useUser();

  async function handleDownload(attachmentId: number) {
    try {
      setIsDownloadingAttachment(true);
      await downloadAttachment(attachmentId);
    } catch (error) {
      console.error('Failed to download attachment:', error);
    } finally {
      setIsDownloadingAttachment(false);
    }
  }

  return (
    <Flex justify='flex-start' align='center' gap='small'>
      {editFilename(attachment.fileName)}
      <DemoPopover content='This feature is not available for demo users'>
        <Tooltip title='Download Attachment'>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(attachment.id)}
            loading={isDownloadingAttachment}
            disabled={isDownloadingAttachment || userSelf?.isDemoUser}
          />
        </Tooltip>
      </DemoPopover>
      <DemoPopover content='This feature is not available for demo users'>
        <Popconfirm
          title='Delete Attachments'
          description='Are you sure you want to delete this attachment?'
          onConfirm={() => deleteSingleAttachment(attachment.id)}
          placement='top'
          okText='Yes'
          cancelText='No'
        >
          <Tooltip title='Delete Attachment'>
            <Button
              icon={<DeleteOutlined />}
              disabled={isDeletingAttachment || userSelf?.isDemoUser}
            />
          </Tooltip>
        </Popconfirm>
      </DemoPopover>
    </Flex>
  );
}

export default AttachmentRow;
