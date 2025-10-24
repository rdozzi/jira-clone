import React, { useState, useCallback } from 'react';
import { AttachmentModalContext } from './AttachmentModalContext';
import { EntityType } from '../types/Attachments';

type AttachmentModalState = {
  isOpen: boolean;
  mode: EntityType;
  modalProps: Record<string, unknown>;
};

export function AttachmentModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [attachmentModalState, setAttachmentModalState] =
    useState<AttachmentModalState>({
      isOpen: false,
      mode: null as EntityType,
      modalProps: {} as Record<string, unknown>,
    });

  function openAttachmentModal(mode: EntityType, modalProps = {}) {
    setAttachmentModalState({ isOpen: true, mode, modalProps });
  }

  const closeAttachmentModal = useCallback(function closeModal() {
    setAttachmentModalState((prev) => ({ ...prev, isOpen: false }));
    setTimeout(() => {
      setAttachmentModalState({ isOpen: false, mode: null, modalProps: {} });
    }, 0);
  }, []);

  return (
    <AttachmentModalContext.Provider
      value={{
        isAttachmentOpen: attachmentModalState.isOpen,
        openAttachmentModal,
        closeAttachmentModal,
        mode: attachmentModalState.mode,
        modalProps: attachmentModalState.modalProps,
      }}
    >
      {children}
    </AttachmentModalContext.Provider>
  );
}
