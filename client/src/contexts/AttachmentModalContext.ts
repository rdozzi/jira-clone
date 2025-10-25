import { createContext } from 'react';
import { EntityType } from '../types/Attachments';

type AttachmentModalType = {
  isAttachmentOpen: boolean;
  openAttachmentModal: (_mode: EntityType, _modalProps: object) => void;
  closeAttachmentModal: () => void;
  modeAttachment: EntityType;
  modalPropsAttachment: Record<string, unknown>;
};

export const AttachmentModalContext = createContext<AttachmentModalType | null>(
  {
    isAttachmentOpen: false,
    openAttachmentModal: () => {},
    closeAttachmentModal: () => {},
    modeAttachment: null,
    modalPropsAttachment: {},
  }
);
