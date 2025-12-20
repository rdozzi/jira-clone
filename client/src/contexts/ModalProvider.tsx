import React, { useState, useCallback } from 'react';
import { ModalContext } from './ModalContext';
import { TicketModalPayload } from '../types/Tickets';

type ModalState<TProps = object> = {
  isOpen: boolean;
  mode: 'create' | 'viewEdit' | null;
  modalProps: TProps;
};

type ModalProviderProps = { children: React.ReactNode };

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalState, setModalState] = useState<ModalState<TicketModalPayload>>({
    isOpen: false,
    mode: null as 'create' | 'viewEdit' | null,
    modalProps: {},
  });

  function openModal(
    mode: 'create' | 'viewEdit',
    modalProps: TicketModalPayload = {}
  ) {
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
