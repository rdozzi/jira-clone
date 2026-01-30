import React, { useState } from 'react';
import { ProjectMemberModalContext } from './ProjectMemberModalContext';
import { ProjectMember } from '../../types/ProjectMember';

type ModalState<TProps = object> = {
  isOpen: boolean;
  mode: 'create' | 'viewEdit' | null;
  modalProps: TProps;
};

type ProjectMemberModalProps = { record?: ProjectMember };

type ModalProviderProps = { children: React.ReactNode };

export function ProjectMemberModalProvider({ children }: ModalProviderProps) {
  const [modalState, setModalState] = useState<
    ModalState<ProjectMemberModalProps>
  >({
    isOpen: false,
    mode: null as 'create' | 'viewEdit' | null,
    modalProps: {},
  });

  function openModal(
    mode: 'create' | 'viewEdit',
    modalProps: ProjectMemberModalProps = {},
  ) {
    setModalState({ isOpen: true, mode, modalProps });
  }

  function closeModal() {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }

  return (
    <ProjectMemberModalContext.Provider
      value={{
        isOpen: modalState.isOpen,
        openModal,
        closeModal,
        mode: modalState.mode,
        modalProps: modalState.modalProps,
      }}
    >
      {children}
    </ProjectMemberModalContext.Provider>
  );
}
