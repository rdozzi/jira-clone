import React, { useState } from 'react';
import { AttachmentModalContext } from './AttachmentModalContext';
import { EntityType } from '../types/Attachments';

type AttachmentModalState = {
  isOpen: boolean;
  mode: EntityType;
  modalProps: Record<string, unknown>;
};

type ModalProviderProps = { children: React.ReactNode };

export function AttachmentModalProvider({ children }: ModalProviderProps) {
  const [attachmentModalState, setAttachmentModalState] =
    useState<AttachmentModalState>({
      isOpen: false,
      mode: null as EntityType,
      modalProps: {} as Record<string, unknown>,
    });

  function openAttachmentModal(mode: EntityType, modalProps = {}) {
    setAttachmentModalState({ isOpen: true, mode, modalProps });
  }

  function closeAttachmentModal() {
    setAttachmentModalState({ isOpen: false, mode: null, modalProps: {} });
  }

  return (
    <AttachmentModalContext.Provider
      value={{
        isAttachmentOpen: attachmentModalState.isOpen,
        openAttachmentModal,
        closeAttachmentModal,
        modeAttachment: attachmentModalState.mode,
        modalPropsAttachment: attachmentModalState.modalProps,
      }}
    >
      {children}
    </AttachmentModalContext.Provider>
  );
}
