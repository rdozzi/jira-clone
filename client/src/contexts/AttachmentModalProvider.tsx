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
  const [modalState, setModalState] = useState<AttachmentModalState>({
    isOpen: false,
    mode: null as EntityType,
    modalProps: {} as Record<string, unknown>,
  });

  function openModal(mode: EntityType, modalProps = {}) {
    console.log('AttachmentModalProvider', mode, modalProps);
    setModalState({ isOpen: true, mode, modalProps });
  }

  function closeModal() {
    setModalState({ isOpen: false, mode: null, modalProps: {} });
  }

  return (
    <AttachmentModalContext.Provider
      value={{
        isOpen: modalState.isOpen,
        openModal,
        closeModal,
        mode: modalState.mode,
        modalProps: modalState.modalProps,
      }}
    >
      {children}
    </AttachmentModalContext.Provider>
  );
}
