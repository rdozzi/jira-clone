import React, { useState } from 'react';
import { OrganizationUseModalContext } from './OrganizationUserModalContext';
import { OrganizationUser } from '../../types/Users';

type ModalState<TProps = object> = {
  isOpen: boolean;
  modalProps: TProps;
};

type OrganizationUserModalProps = { record?: OrganizationUser };

type ModalProviderProps = { children: React.ReactNode };

export function OrganizationUserModalProvider({
  children,
}: ModalProviderProps) {
  const [modalState, setModalState] = useState<
    ModalState<OrganizationUserModalProps>
  >({
    isOpen: false,
    modalProps: {},
  });

  function openModal(modalProps: OrganizationUserModalProps = {}) {
    setModalState({ isOpen: true, modalProps });
  }

  function closeModal() {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }

  return (
    <OrganizationUseModalContext.Provider
      value={{
        isOpen: modalState.isOpen,
        openModal,
        closeModal,
        modalProps: modalState.modalProps,
      }}
    >
      {children}
    </OrganizationUseModalContext.Provider>
  );
}
