import { createPortal } from 'react-dom';
import { Modal, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { EntityType, Attachment } from '../types/Attachments';
import { useGetAttachments } from '../features/attachments/useGetAttachments';
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
  closeAttachmentModal,
  entityType,
  record,
}: AttachmentModalProps) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { isFetchingAttachments, attachments, attachmentError } =
    useGetAttachments(entityType, record?.id);

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
      <div>Description: {record.description}</div>
      <div>Entity Type: {entityType}</div>
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
