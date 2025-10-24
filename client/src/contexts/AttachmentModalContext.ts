import { createContext } from 'react';
import { EntityType } from '../types/Attachments';

interface AttachmentModalType {
  isAttachmentOpen: boolean;
  openAttachmentModal: (_mode: EntityType, _modalProps: object) => void;
  closeAttachmentModal: () => void;
  mode: EntityType;
  modalProps: Record<string, unknown>;
}

export const AttachmentModalContext = createContext<AttachmentModalType | null>(
  null
);
