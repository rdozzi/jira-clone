import React, { createContext, useContext, useState } from 'react';

// Types
type ModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

type ModalProviderProps = { children: React.ReactNode };

// 1. Create a context
const ModalContext = createContext<ModalContextType | null>(null);

// 2. Create a custom hook to consume the context
export function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');

    return context;
  }
}

// 3. Create child compoenents that will consume the context
// None Required

// 4. Export the context and the custom hook

// 5. Wrap the application in the context provider

// 6. Use the custom hook in the child components

// 7. Create functions to open and close the modal
