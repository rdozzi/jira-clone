import React, { createContext, useState } from 'react';

type ModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  mode: 'create' | 'viewEdit';
  setModeCreate: () => void;
  setModeViewEdit: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ModalContext = createContext<ModalContextType | null>(null);

type ModalProviderProps = { children: React.ReactNode };

export function ModalProviderContext({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'viewEdit'>('create');

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function setModeCreate() {
    setMode('create');
  }

  function setModeViewEdit() {
    setMode('viewEdit');
  }

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        mode,
        setModeCreate,
        setModeViewEdit,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
