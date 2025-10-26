import { createContext } from 'react';
import { EntityType } from '../types/Attachments';

type AttachmentModalType = {
  isOpen: boolean;
  openModal: (_mode: EntityType, _modalProps: Record<string, unknown>) => void;
  closeModal: () => void;
  mode: EntityType;
  modalProps: Record<string, unknown>;
};

export const AttachmentModalContext = createContext<AttachmentModalType | null>(
  null
);
