import React, { useState } from 'react';
import { TicketModalContext } from './TicketModalContext';
import { Ticket } from '../../types/Ticket';

type ModalState<TProps = object> = {
  isOpen: boolean;
  mode: 'create' | 'viewEdit' | null;
  modalProps: TProps;
};

type TicketModalProps = { record?: Ticket };

type ModalProviderProps = { children: React.ReactNode };

export function TicketModalProvider({ children }: ModalProviderProps) {
  const [modalState, setModalState] = useState<ModalState<TicketModalProps>>({
    isOpen: false,
    mode: null as 'create' | 'viewEdit' | null,
    modalProps: {},
  });

  function openModal(
    mode: 'create' | 'viewEdit',
    modalProps: TicketModalProps = {},
  ) {
    setModalState({ isOpen: true, mode, modalProps });
  }

  function closeModal() {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }

  return (
    <TicketModalContext.Provider
      value={{
        isOpen: modalState.isOpen,
        openModal,
        closeModal,
        mode: modalState.mode,
        modalProps: modalState.modalProps,
      }}
    >
      {children}
    </TicketModalContext.Provider>
  );
}
