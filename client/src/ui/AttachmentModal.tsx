import { createPortal } from 'react-dom';
import { Modal, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { EntityType, Attachment } from '../types/Attachments';
import { useGetAttachments } from '../features/attachments/useGetAttachments';
import { useState } from 'react';
import AttachmentRow from './AttachmentRow';
import Loading from './Loading';
import { useAttachmentModal } from '../contexts/useAttachmentModal';
import { useUploadSingleAttachment } from '../features/attachments/useUploadSingleAttachment';

type ModalPropsWithRecord = {
  id?: number;
  record?: { title?: string };
  [key: string]: any;
};

function AttachmentModal() {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { isOpen, closeModal, mode, modalProps } = useAttachmentModal() as {
    isOpen: boolean;
    closeModal: () => void;
    mode: EntityType;
    modalProps: ModalPropsWithRecord;
  };
  const { isFetchingAttachments, attachments, attachmentError } =
    useGetAttachments(
      mode,
      typeof modalProps?.id === 'number' ? modalProps.id : -1
    );
  const { uploadSingleAttachment, isUploadingAttachment } =
    useUploadSingleAttachment();

  if (isFetchingAttachments) return <Loading />;
  if (attachmentError) return <div>Error loading attachments</div>;

  function onOk() {
    closeModal();
  }

  async function handleCustomRequest(options: any) {
    const { onSuccess, onError, file } = options;

    try {
      uploadSingleAttachment({
        file,
        entityType: String(mode),
        entityId: Number(modalProps.id),
      });
      onSuccess?.({}, file);
    } catch (error) {
      onError?.(error);
    }
  }

  if (isFetchingAttachments) setConfirmLoading(true);

  return createPortal(
    <Modal
      open={isOpen}
      onOk={onOk}
      onCancel={onOk}
      cancelButtonProps={{ style: { display: 'none' } }}
      confirmLoading={confirmLoading}
      getContainer={false}
      destroyOnClose={true}
      mask={false}
      title={'Attachments'}
      loading={isFetchingAttachments && <Loading />}
    >
      <div>
        Title:{' '}
        {typeof modalProps?.record?.title === 'string'
          ? modalProps.record.title
          : ''}
      </div>
      <div>Entity Type: {mode as EntityType}</div>
      {attachments && attachments.length > 0 ? (
        attachments.map((attachment: Attachment) => (
          <AttachmentRow attachment={attachment} key={attachment.id} />
        ))
      ) : (
        <div> No Attachments Found</div>
      )}
      <Upload
        customRequest={handleCustomRequest}
        showUploadList={false}
        multiple={false}
        disabled={isUploadingAttachment}
      >
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </Modal>,
    document.body
  );
}

export default AttachmentModal;
