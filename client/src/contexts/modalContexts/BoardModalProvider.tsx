import React, { useState } from 'react';
import { BoardModalContext } from './BoardModalContext';
import { Board } from '../../types/Board';

type ModalState<TProps = object> = {
  isOpen: boolean;
  mode: 'create' | 'viewEdit' | null;
  modalProps: TProps;
};

type BoardModalProps = { record?: Board };

type ModalProviderProps = { children: React.ReactNode };

export function BoardModalProvider({ children }: ModalProviderProps) {
  const [modalState, setModalState] = useState<ModalState<BoardModalProps>>({
    isOpen: false,
    mode: null as 'create' | 'viewEdit' | null,
    modalProps: {},
  });

  function openModal(
    mode: 'create' | 'viewEdit',
    modalProps: BoardModalProps = {},
  ) {
    setModalState({ isOpen: true, mode, modalProps });
  }

  function closeModal() {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }

  return (
    <BoardModalContext.Provider
      value={{
        isOpen: modalState.isOpen,
        openModal,
        closeModal,
        mode: modalState.mode,
        modalProps: modalState.modalProps,
      }}
    >
      {children}
    </BoardModalContext.Provider>
  );
}
