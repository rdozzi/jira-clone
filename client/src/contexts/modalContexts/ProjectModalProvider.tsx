import React, { useState } from 'react';
import { ProjectModalContext } from './ProjectModalContext';
import { Project } from '../../types/Project';

type ModalState<TProps = object> = {
  isOpen: boolean;
  mode: 'create' | 'viewEdit' | null;
  modalProps: TProps;
};

type ProjectModalProps = { record?: Project };

type ModalProviderProps = { children: React.ReactNode };

export function ProjectModalProvider({ children }: ModalProviderProps) {
  const [modalState, setModalState] = useState<ModalState<ProjectModalProps>>({
    isOpen: false,
    mode: null as 'create' | 'viewEdit' | null,
    modalProps: {},
  });

  function openModal(
    mode: 'create' | 'viewEdit',
    modalProps: ProjectModalProps = {},
  ) {
    setModalState({ isOpen: true, mode, modalProps });
  }

  function closeModal() {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }

  return (
    <ProjectModalContext.Provider
      value={{
        isOpen: modalState.isOpen,
        openModal,
        closeModal,
        mode: modalState.mode,
        modalProps: modalState.modalProps,
      }}
    >
      {children}
    </ProjectModalContext.Provider>
  );
}
