import React, { useState, useCallback } from 'react';
import { ModalContext } from './ModalContext';

type ModalState = {
  isOpen: boolean;
  mode: 'create' | 'viewEdit' | null;
  modalProps: Record<string, unknown>;
};

type ModalProviderProps = { children: React.ReactNode };

export function ModalProviderContext({ children }: ModalProviderProps) {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: null as 'create' | 'viewEdit' | null,
    modalProps: {} as Record<string, unknown>,
  });

  function openModal(mode: 'create' | 'viewEdit', modalProps = {}) {
    setModalState({ isOpen: true, mode, modalProps });
  }

  const closeModal = useCallback(function closeModal() {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    setTimeout(() => {
      setModalState({ isOpen: false, mode: null, modalProps: {} });
    }, 0);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isOpen: modalState.isOpen,
        openModal,
        closeModal,
        mode: modalState.mode,
        modalProps: modalState.modalProps,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
