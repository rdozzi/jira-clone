import { createPortal } from 'react-dom';
import { Modal, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { EntityType, Attachment } from '../types/Attachments';
import { useGetAttachments } from '../features/attachments/useGetAttachments';
import { useAttachmentModal } from '../contexts/useAttachmentModal';
import { useState } from 'react';
import AttachmentRow from './AttachmentRow';
import Loading from './Loading';

interface AttachmentModalProps {
  isAttachmentOpen: boolean;
  closeAttachmentModal: () => void;
  entityType: EntityType;
  record?: any;
  mode: EntityType;
}

function AttachmentModal({
  isAttachmentOpen,
  entityType,
  record,
}: AttachmentModalProps) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { isFetchingAttachments, attachments, attachmentError } =
    useGetAttachments('TICKET', 1);
  const { closeAttachmentModal } = useAttachmentModal();

  if (isFetchingAttachments) return <Loading />;
  if (attachmentError) return <div>Error loading attachments</div>;

  function onOk() {
    closeAttachmentModal();
  }

  return createPortal(
    <Modal
      open={isAttachmentOpen}
      onOk={onOk}
      onCancel={onOk}
      cancelButtonProps={{ style: { display: 'none' } }}
      confirmLoading={confirmLoading}
      getContainer={false}
      destroyOnClose={true}
      mask={false}
      title={'Attachments'}
    >
      <div>Description: Entity Description</div>
      <div>Entity Type: Entity Type</div>
      {attachments && attachments.length > 0 ? (
        attachments.map((attachment: Attachment) => (
          <AttachmentRow attachment={attachment} key={attachment.id} />
        ))
      ) : (
        <div> No Attachments Found</div>
      )}
      <Upload>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </Modal>,
    document.body
  );
}

export default AttachmentModal;
